from openai import OpenAI
import yfinance as yf
import requests
import tiktoken
import re
from datetime import datetime

import requests

proxies = {
    'http': 'http://127.0.0.1:7890',
    'https': 'http://127.0.0.1:7890',
    'all': 'socks5://127.0.0.1:7890'
}
session = requests.session()
session.proxies.update(proxies)

API_KEY = '..'
client = OpenAI(api_key=API_KEY)

class Agent:

    def __init__(self, user_query) -> None:

        """
        The agent is initialized based on the user's query. All the following actions are centered around this.
        After initialization, make the following calls to get the response:
        1. self.retrive_stock_data(): This will retrieve related stock data, including price and news based on the user query. You can provide all related information at this moment.
        2. self.generate_answer(): This will summarize all news and stock data, and provide a comprehensive answer to the user's query. This is the final output.
        """


        self.gpt_model = "gpt-4-turbo-preview"
        self.messages = [
                {"role": "system", "content": "You are an intelligent financial assistant. You should serve as an expert in selecting and summarizing financial news to provide deep insights."},
            ]
        
        self.user_query = user_query

        self.stock_data = {}
        self.all_news = {}
        self.answer = None
        # retrieve stock data and news based on the user query
        self._retrieve_stock_data()

        self.encoding = tiktoken.encoding_for_model(self.gpt_model)


    ### User interface functions
    def retrieve_stock_data(self):
        return self.stock_data, self.sorted_news


    def generate_answer(self):
        self._generate_answer(n_news=3)
        return self.answer



    def _retrieve_stock_data(self):
        """
        This is the first function to call. This function retrieve related stock data, including price and news based on the user query
        The response include: 
        {
            "stock data": a dictionary of stock data of the format {TICKER: DATA}. Each DATA value is a dictionary:
                {'latest date': latest_date, 'open': open price, 'close': close price, 'high': daily highest price, 'low': daily lowest price, 'volume': daily volume}
            "sorted_news": a list of all related news sorted based on relevance, each is a dictionary {"title": TITLE, "summary": SUMMARY, "url": URL, "publisher": PUBLISHER, "date": DATE, 
            "related stocks": RELATED_STOCKS, 'relevance': RELEVANCE}
            }
        """

        # Step 1: Get stock tickers to retrieve data
        for trial in range(2):
            # try multiple times until the response is good with reasonable values of tickers
            tickers = self.select_stock_tickers()
            if 0 < len(tickers) <= 6:
                break


        if len(tickers) > 6 or len(tickers) == 0:
            # Error: the user's query is too broad or not relevant
            # Get only general stock market index
            self.update_data_with_tickers(tickers=['^GSPC', '^DJI', '^IXIC'])
            # sort news based on relevance
            sorted_news_items = sorted(self.all_news.items(), key=lambda item: item[1]['relevance'], reverse=True)
            self.sorted_news = [item[1] for item in sorted_news_items][:3]

            # The answer to the user will be a prompt to ask for more specific query
            self.answer =  'Your question might be too broad. I have prepared general stock market index data and news for you. If this is not what you are looking for, please try to be more specific in your question. For example, ask me "How did the AI stocks perform?"'
            return
        

        # Step 2: retrieve stock data and news based on the tickers
        self.update_data_with_tickers(tickers=tickers)


        # Step 3: expand to related tickers
        if len(self.stock_data) > 1:
            # only consider extra tickers if there are more than 1 tickers (in case user is only asking about one stock, do not consider related stocks)
            ticker_relevance = {}
            for uuid in self.all_news:
                relevance = self.all_news[uuid]['relevance']
                for tk in self.all_news[uuid]['related stocks']:
                    if '^' in tk:
                        # market index, do not consider
                        continue
                    if tk not in self.stock_data:
                        if tk not in ticker_relevance:
                            ticker_relevance[tk] = 0
                        ticker_relevance[tk] += relevance
            # sort extra tickers based on relevance
            sorted_tickers = sorted(list(ticker_relevance), key=lambda tk: ticker_relevance[tk], reverse=True)
            # update stock data with top related tickers
            max_tickers = min(2, len(self.stock_data)//2)    # only consider at most 2 related tickers
            self.update_data_with_tickers(tickers=sorted_tickers[:max_tickers])


        # sort news based on relevance
        sorted_news_items = sorted(self.all_news.items(), key=lambda item: item[1]['relevance'], reverse=True)
        self.sorted_news = [item[1] for item in sorted_news_items][:5]


    def _generate_answer(self, n_news):
        """
        After initialization with the stock news and data, this function generates a summarized answer to the user query, based on all retrieved stock data and news.
        The response is a string of answer summarizing all the information about the data for the user query.
        """

        for news in self.sorted_news[:n_news]:
            # summarize the top 3 news
            news['summary'] = self.extract_summarize_url(url = news['url'])

        all_news_string = '\n\n'.join([f"Title: {news['title']} Summary: {news['summary']} Date: {news['date']}" for news in self.sorted_news[:n_news]])

        prompt = f"The user has asked the following query: \
                {self.user_query} \n \
                I have prepared all the related news and data about the stockes related to this query and presented to the user. \
                Your task now is to answer the user's query in a nice and professional manner, using the stock news and data provided. \
                Here are the related news articles: \n \
                    {all_news_string} \n\n \
                Please make a direct answer to the user, based on some or all of the news provided. Your answer should be focused on the user's initial query, and \
                elaborating in a professional, consice, and insightful manner."
        
        self.answer = self._call_openai(prompt=prompt)


    
    def _call_openai(self, prompt, gpt_model='default'):
        # base function to call OpenAI API with the specific prompt

        if gpt_model == 'default':
            gpt_model = self.gpt_model

        messages = [
                {"role": "system", "content": "You are a intelligent financial assistant. You are an expert in selecting and summarizing financial news to provide deep insights."},
                {"role": "user", "content": prompt}
            ]

        completion = client.chat.completions.create(
            model = self.gpt_model,
            messages = messages,

            )
        response = completion.choices[0].message.content

        return response
    

    def select_stock_tickers(self):
        # based on the user query, ask GPT to generate a list of stock tickers to retrieve information

        prompt = f"The user has given the following query: {self.user_query} \n \
            Based on the query, please generate a list of most relavant stock tickers to answer this query. \
            Please only include tickers that are necessary to answer this question, and order them by relevance. \
            If the question is too broad or there are too many related stocks, give the top most relevant ones. \
            Your answer should be a string with tickers separeted by spaces, e.g. \n \
            Answer: AAPL MSFT TSLA"
        
        response = self._call_openai(prompt=prompt)
        
        tickers = []
        for tk in response.split():
            # clean up chars
            tk_clean = ''.join(re.findall(r'[A-Z\^]', tk))
            if len(tk_clean) > 0 and len(tk)-len(tk_clean) < 3 and tk_clean not in tickers:
                tickers.append(tk_clean)
        return tickers
    
    
    def get_stock_data(self, ticker):
        # retrieve relevant data about one stock ticker. Return a dictionary of info

        stock = yf.Ticker(ticker)

        news = stock.news
        # news is a dictionary with the following keys: ['uuid', 'title', 'publisher', 'link', 'providerPublishTime', 'type', 'thumbnail', 'relatedTickers']

        history = stock.history()
        T = history.index[-1]
        
        prices = history.loc[T]

        latest_date = str(T)[:10]

        # show price with 2 decimal points
        return {'news': news, 'Date': latest_date, 
                'Open': round(prices['Open'], 2), 'Close': round(prices['Close'], 2), 
                'High': round(prices['High'], 2), 'Low': round(prices['Low'], 2), 
                'Volume': prices['Volume']}
    


    def update_data_with_tickers(self, tickers):
        # Step 2: Retrieve financial data for the tickers
        for ticker in tickers:
            cleaned_ticker = ''.join(re.findall(r'[A-Z\^]', ticker))
            try:
                self.stock_data[cleaned_ticker] = self.get_stock_data(ticker=cleaned_ticker)
            except:
                continue

        if len(self.stock_data) == 0:
            # Error: no stock info found
            return 'I can not find the stock data related to your request. Please try to be more stock specific in your question. For example, ask me "How did the GPU stocks performe?"'
        
        # Step 3: Organize stock data and news
        for ticker in self.stock_data:
            if 'news' not in self.stock_data[ticker]:
                # news already processed. 
                continue

            # get all stock news
            stock_news = self.stock_data[ticker].pop('news')

            for news in stock_news:
                if news['uuid'] in self.all_news:
                    continue
                url = news['link']
                title = news['title']
                date = datetime.fromtimestamp(news['providerPublishTime']).strftime('%Y-%m-%d')
                publisher = news['publisher']

                related_stocks = news['relatedTickers']

                self.all_news[news['uuid']] = {'title': title, 'url': url, 'publisher': publisher, 'date': date, 'related stocks': related_stocks}

        # calculate relevance based on ratio of target stocks
        for uuid in self.all_news:
            related_stocks = self.all_news[uuid]['related stocks']
            relevance = 2 * len([tk for tk in related_stocks if tk in self.stock_data]) / (len(related_stocks) + len(self.stock_data))
            self.all_news[uuid]['relevance'] = relevance


    
    def extract_summarize_url(self, url):
        # extract content from a url and summarize
        response = requests.get(url)

        # Check if the request was successful
        if response.status_code == 200:
            html_content = response.text[:10000]
        else:
            # return empty string
            return ''
        
        # # check the length of the content and truncate
        # tokens = self.encoding.encode(html_content)
        # if len(tokens) > 126000:
        #     html_content = self.encoding.decode(tokens=tokens[:126000])
        
        prompt = f"Please extract the article content from the following web page source file, and summarize into a short paragraph. \
                {html_content}"
        
        return self._call_openai(prompt=prompt)


    
    
    
    
    
    
    
    
    
    
    
    
    ################### LEGACY FUNCTIONS BELOW #####################
    
    
    def generate_report(self, all_news, stock_data, user_query):
        # generate a report from list of all news summaries and all stock data info

        all_news_string = '\n\n'.join([f"Title: {all_news[uuid]['title']} Summary: {all_news[uuid]['summary']} Date: {all_news[uuid]['date']}" for uuid in all_news])

        prompt = f"The user has asked the following query: \
                {user_query} \n \
                I have prepared all the data about the stockes related to this query. \
                Your task now is to generate a nice and professional report using the stock data provided to answer the user's query. \
                You will be provided with a list of news article summaries, and a list of related stocks with their price data. \
                Here are the news article summaries: \n \
                    {all_news_string} \n\n \
                Here are the daily data for the related stocks: \n \
                    {str(stock_data)} \n \
                Please generate a rigorous, professional, and insightful report about these stocks to answer the user's query."
        
        return self._call_openai(prompt=prompt)


    def execute(self, user_query):
            """
            LEGACY FUNCTION. NOT IN USE.

            This is the main function to call. The agent takes in user query, and return aggregated response.
            The response include: 
            {
                "report": a string of report summarizing all the information about the data about the query,
                "stock data": a dictionary of stock data of the format {TICKER: DATA}. Each DATA value is a dictionary:
                    {'latest date': latest_date, 'open': open price, 'close': close price, 'high': daily highest price, 'low': daily lowest price, 'volume': daily volume}
                "all_news": a dictionary of all related news with uuid as the keys, each is a dictionary {"title": TITLE, "summary": SUMMARY, "url": URL, "publisher": PUBLISHER, "date": DATE}
                }
            """

            # Step 1: Get stock tickers to retrieve data
            for trial in range(3):
                # try multiple times until the response is good with reasonable values of tickers
                tickers = self.select_stock_tickers(user_query=user_query)
                if len(tickers) <= 10:
                    break

            # Step 2: Retrieve financial data for the tickers
            stock_data = {}
            for ticker in tickers:
                cleaned_ticker = ''.join(re.findall(r'[A-Z]', ticker))
                try:
                    stock_data[cleaned_ticker] = self.get_stock_data(ticker=cleaned_ticker)
                except:
                    continue

            # Step 3: extract article content from each news url and summarize
            all_news = {}
            for ticker in stock_data:
                # get all stock news
                stock_news = stock_data[ticker].pop('news')

                for news in stock_news:
                    if news['uuid'] in all_news:
                        continue

                    # extract from url
                    url = news['link']
                    summary = self.extract_summarize_url(url = url)
                    title = news['title']
                    date = datetime.fromtimestamp(news['providerPublishTime']).strftime('%Y-%m-%d')
                    publisher = news['publisher']
                    related_stocks = news['relatedTickers']

                    all_news[news['uuid']] = {'title': title, 'summary': summary, 'url': url, 'publisher': publisher, 'date': date, 'related stocks': related_stocks}

            # Step 4: Generate a report to answer the user's query
            report = self.generate_report(all_news=all_news, stock_data=stock_data, user_query=user_query)

            return {'report': report, 'stock data': stock_data, 'all news': all_news}