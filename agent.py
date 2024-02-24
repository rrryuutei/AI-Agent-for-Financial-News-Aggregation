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

    def __init__(self) -> None:
        self.gpt_model = "gpt-4-turbo-preview"
        self.messages = [
                {"role": "system", "content": "You are a intelligent financial assistant. You are an expert in selecting and summarizing financial news to provide deep insights."},
            ]
        
        self.encoding = tiktoken.encoding_for_model(self.gpt_model)

    def execute(self, user_query):
        """
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

                all_news[news['uuid']] = {'title': title, 'summary': summary, 'url': url, 'publisher': publisher, 'date': date}

        # Step 4: Generate a report to answer the user's query
        report = self.generate_report(all_news=all_news, stock_data=stock_data, user_query=user_query)

        return {'report': report, 'stock data': stock_data, 'all news': all_news}
    
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
    
    def select_stock_tickers(self, user_query):
        # based on the user query, ask GPT to generate a list of stock tickers to retrieve information

        prompt = f"The user has given the following query: {user_query} \n \
            Based on the query, please generate a list of most relavant stock tickers to answer this query. \
            Please only include tickers that are necessary to answer this question, and order them by relevance. \
            If the question is too broad or there are too many related stocks, give the most relevant top ones. \
            Your answer should be a string with tickers separeted by spaces, e.g. AAPL MSFT."
        
        tickers = self._call_openai(prompt=prompt).split(' ')

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

        return {'news': news, 'latest date': latest_date, 
                'open': prices['Open'], 'close': prices['Close'], 
                'high': prices['High'], 'low': prices['Low'], 
                'volume': prices['Volume']}
    
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
