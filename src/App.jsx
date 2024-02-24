import { useState, useRef } from 'react';
import left_bg from './assets/left.png';
import right_bg from './assets/right.png';
import { CSSTransition } from 'react-transition-group';

import { addCount, readCount } from "./util/index"

import { Tooltip, message } from 'antd';

function App() {
  const [searchVal, setSearchVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isContent, setIsContent] = useState(true);
  const [allData, setAllData] = useState({
    all_news: {
      "04863ded-ab25-3f8d-9165-422918c11fb2": {
        "date": "2024-02-23",
        "publisher": "Barrons.com",
        "summary": "The article titled \"Nvidia Is Now the King of the Mag 7. Why It’s Not Even Close.\" emphasizes Nvidia's standout position within the technology sector, distinguishing it significantly from competitors like Microsoft and Amazon. Nvidia has showcased exceptional revenue growth and achievements, particularly in data center advancements, under the leadership of Colette Kress. This performance sets Nvidia apart from other big tech firms, securing its status as the dominant force among the major seven technology companies, so much so that there appears to be little competition close to challenging its supremacy.",
        "title": "Nvidia Is Now the King of the Mag 7. Why It’s Not Even Close.",
        "url": "https://finance.yahoo.com/m/04863ded-ab25-3f8d-9165-422918c11fb2/nvidia-is-now-the-king-of-the.html"
      },
      "20af5d56-d45b-3cae-96bd-5c5d6c3bc1ed": {
        "date": "2024-02-23",
        "publisher": "Reuters",
        "summary": "The article reports that on February 23, Taiwan and South Korean stocks reached new heights, with Taiwan's stocks achieving a fresh record high and South Korean shares reaching their highest level since May 2022. This surge was largely attributed to Nvidia's significant earnings results, which showed a three-fold jump in first-quarter revenue forecasts, driven by strong demand for its AI chips. Additionally, the article mentions that Malaysian stocks saw a slight increase of 0.2% after the country's consumer price index for January rose less than expected. This news comes amidst other economic developments, including lower-than-expected inflation rates in Singapore and Malaysia, and upcoming economic data releases such as China's February PMI and India's Q4 GDP.",
        "title": "EMERGING MARKETS-Taiwan, S.Korean stocks shine on Nvidia results; Asian FX edges lower",
        "url": "https://finance.yahoo.com/news/emerging-markets-taiwan-korean-stocks-084111027.html"
      },
      "4a12ec5c-a08d-3a2d-9ede-2b99bfe5b78b": {
        "date": "2024-02-23",
        "publisher": "Associated Press Finance",
        "summary": "The article discusses a rally in the Asian stock markets that was triggered by Nvidia's outstanding financial results. The tech company's performance incited a broader rally among technology companies, which in turn lifted Wall Street to another all-time high. Additionally, the article mentions concerns about China's real estate market, highlighting government data indicating a continued price decline in new homes across first-tier cities, with a 0.4% drop in January from the previous month. This trend suggests a lack of recovery in the sector, juxtaposing the soaring stock markets with underlying economic challenges in one of the region's largest economies.",
        "title": "Stock market today: Global stocks advance after Nvidia sets off a rally on Wall Street",
        "url": "https://finance.yahoo.com/news/stock-market-today-asian-stocks-075342874.html"
      },
      "5a0c890e-83a5-36c2-912b-2c2d8c038a7c": {
        "date": "2024-02-23",
        "publisher": "Insider Monkey",
        "summary": "The article highlights Baron Fifth Avenue Growth Fund's investor letter for the fourth quarter of 2023, where NVIDIA Corporation (NVDA) is identified as a key beneficiary of GenAI. Baron Funds, the investment management company behind the fund, noted a significant performance increase of 17.6% for its Institutional Shares during the quarter, surpassing both the Russell 1000 Growth Index and the S&P 500's gains for the same period. This performance is attributed to NVIDIA's strong positioning in the rapidly evolving GenAI landscape, pointing towards the company's promising future prospects within this innovative domain.",
        "title": "Baron Fifth Avenue Growth Fund: “NVIDIA Corporation (NVDA) is a Clear Beneficiary of GenAI”",
        "url": "https://finance.yahoo.com/news/baron-fifth-avenue-growth-fund-081115082.html"
      },
      "630710e4-ed80-349c-86a2-2e6d24436e4d": {
        "date": "2024-02-23",
        "publisher": "Reuters",
        "summary": "Global stock markets are experiencing significant gains this week, largely fueled by Nvidia's impressive performance, which saw the company's stock surge by 16.4% overnight and add a record $277 billion in market value. Nvidia's results have ignited a global rally in technology stocks, strongly influenced by advancements in artificial intelligence (AI). This has led to the S&P 500, Dow Jones Industrials, Europe's STOXX 600, and Japan's Nikkei share average all reaching record highs. Additionally, the yen has weakened against a range of currencies, highlighting the broad impact of the tech-driven market enthusiasm.",
        "title": "GLOBAL MARKETS-Stocks bask in tech mania, Nvidia boom",
        "url": "https://finance.yahoo.com/news/global-markets-stocks-bask-tech-062950112.html"
      },
      "7dce9c20-562c-30fb-bcad-1aacab01b61f": {
        "date": "2024-02-23",
        "publisher": "Reuters",
        "summary": "The article \"EMERGING MARKETS-Taiwan, S.Korean stocks shine on Nvidia results; Asian FX muted\" highlights the positive impact of Nvidia's financial results on Taiwan and South Korea's stock markets. On the back of Nvidia's announcement forecasting a significant increase in first-quarter revenue due to strong demand for its AI chips, Taiwan's equities reached a new record high with up to 0.9% rise, and South Korean stocks saw their highest level since May 2022, with up to a 1.2% gain. The news also influenced the Malaysian stock market, which saw a marginal increase after the country's consumer price index for January showed a lower-than-expected rise of 1.5% year-on-year. Conversely, Singaporean stocks experienced a 1.4% decrease. The article suggests a correlation between Nvidia's performance in the global tech market and investor confidence in Asian markets, particularly those involved in technology and AI chip manufacturing. Inflation data from Singapore and Malaysia coming in lower than expected might also have contributed to market movements.",
        "title": "EMERGING MARKETS-Taiwan, S.Korean stocks shine on Nvidia results; Asian FX muted",
        "url": "https://finance.yahoo.com/news/emerging-markets-taiwan-korean-stocks-063136419.html"
      },
      "8e89c53c-3940-31da-b624-82c4641f3730": {
        "date": "2024-02-23",
        "publisher": "Bloomberg",
        "summary": "The article titled \"Asian Shares Climb as Global Equities Hit Records: Markets Wrap\" from Bloomberg reports a significant rally in Asian stock markets, riding the wave of a global equities rally that has seen markets in the US, Europe, and Japan reach all-time highs. This surge, marking a second day of gains, is part of a broader trend fueled by various factors including advancements in AI, which drove Nvidia's shares up significantly, innovative financial strategies to avoid taxes on T-Bills, and a historic achievement in private space exploration with the US landing on the Moon. The rally in stocks worldwide reflects a sweeping enthusiasm in financial markets, underscored by significant network expansion by AT&T causing an outage, and showcasing a global economic optimism.",
        "title": "Stocks, Futures Pause After Record-Busting Rally: Markets Wrap",
        "url": "https://finance.yahoo.com/news/asian-shares-climb-equities-hit-231016099.html"
      },
      "ecdda861-1bcd-3560-8535-e5ca8f82c5a3": {
        "date": "2024-02-23",
        "publisher": "Reuters",
        "summary": "The article titled \"RPT-EMERGING MARKETS-Taiwan, S.Korean stocks shine on Nvidia results; Asian FX muted\" highlights the performance of the stock markets in Taiwan and South Korea following Nvidia's announcement of a substantial increase in its first-quarter revenue due to strong demand for its AI chips. Taiwan's equities rose by up to 0.9%, while South Korean stocks saw gains of up to 1.2%. On the other hand, Malaysian stocks showed a marginal increase after its consumer price index for January indicated a rise of 1.5% year-over-year, which was slightly below the 1.6% growth economists had predicted in a Reuters poll. This positive market movement reflects the impact of Nvidia's performance on related markets, especially in countries known for their substantial contributions to the tech industry.",
        "title": "RPT-EMERGING MARKETS-Taiwan, S.Korean stocks shine on Nvidia results; Asian FX muted",
        "url": "https://finance.yahoo.com/news/rpt-emerging-markets-taiwan-korean-064153683.html"
      }
    },
    report: `
      ### Nvidia Corporation (NVDA) Stock Performance Report - February 22, 2024\n\n#### Overview\n\nNvidia Corporation (NVDA), a leading technology company renowned for its advanced artificial intelligence (AI) chips, showcased an exceptional performance on February 22, 2024. Drawing significant attention across global markets, Nvidia's financial achievements have not only fueled record highs in several stock indices but have also underlined the company's dominant position in the technology sector and AI advancements.\n\n#### Nvidia's Stock Data for February 22, 2024:\n\n- **Opening Price**: $750.25\n- **Closing Price**: $785.38\n- **Day's High**: $785.75\n- **Day's Low**: $742.20\n- **Volume**: 85,648,100\n\n#### Key Insights:\n\n1. **Exceptional Closing Performance**: Nvidia's stock experienced a notable uplift, closing at $785.38, which represents a significant increase from the opening price of $750.25. This surge in price exemplifies market confidence in Nvidia's strategic positioning and growth prospects, particularly in the rapidly evolving AI sector.\n\n2. **Record Trading Volume**: The trading volume for Nvidia on February 22, 2024, was remarkably high, amounting to 85,648,100 shares traded. This substantial volume indicates heightened investor interest and participation in Nvidia's stock, following the company's forecast of a tripling in first-quarter revenue, largely attributed to robust demand for its AI chips.\n\n3. **Market Impact**: Nvidia's stock performance has had a profound impact on global stock markets, contributing to significant gains across major indices. Reports highlight Nvidia as a pivotal force behind the global rally in technology stocks, symptomatic of the broader investment enthusiasm driven by AI advancements.\n\n#### Analyst Commentary:\n\nAnalysts attribute Nvidia's standout performance to several factors. Principally, the company's innovative lead in General AI (GenAI) has been emphasized as a key driver of its success, with Nvidia identified as a clear beneficiary of the burgeoning AI market. Investment firms, such as Baron Fifth Avenue Growth Fund, have recognized Nvidia's promising future prospects within this innovative domain, praising its strong positioning and performance.\n\nFurthermore, Nvidia's distinguished achievements have solidified its status as the King of the 'Mag 7' in the technology sector, surpassing tech giants like Microsoft and Amazon. This dominance is linked to pivotal advancements in data center technologies and leadership under Colette Kress, underscoring the company's unparalleled trajectory in revenue growth and tech innovation.\n\n#### Global Market Repercussion:\n\nThe ripple effects of Nvidia's performance are evident across various markets, notably boosting Taiwanese and South Korean stocks to new heights, given these countries' significant contributions to the tech industry. The enthusiasm surrounding Nvidia has also instigated a broader tech mania, with global stock indices such as the S&P 500, Dow Jones Industrials, and Europe's STOXX 600 achieving record highs.\n\n#### Conclusion:\n\nNvidia Corporation's exceptional performance on February 22, 2024, has not only underscored its leadership in the technology and AI sectors but has also played a pivotal role in influencing global market dynamics. With a surge in its stock price, record trading volumes, and a significant impact on global tech stocks, Nvidia continues to demonstrate its vital role in shaping the future of technological advancements and market trends. Investors and market watchers alike will undoubtedly keep a close eye on Nvidia's strategic moves and their implications for global markets in the coming months.
    `,
    stock_data: {
      "NVDA": {
        "close": 785.3800048828125,
        "high": 785.75,
        "latest date": "2024-02-22",
        "low": "742.2000122070312",
        "open": 750.25,
        "volume": 85648100
      }
    }
  });
  const contentRef = useRef(null);

  const fetchData = async (userInput) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('user_input', userInput);

      const response = await fetch('/dev', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log("fetchData", data);
      setIsLoading(false);
      setIsContent(true);
      return data;

    } catch (error) {
      setIsLoading(false);
      message.error(error.message)
      console.error('There was a problem with the fetch operation:', error.message);
    }
  };

  return (
    <div className="fixed w-full h-full top-0 left-0 overflow-hidden text-center">
      <img className='w-4/12 -left-72 top-44 absolute -z-10 select-none animate-bounce' src={left_bg} />
      <img className='w-3/12 left-96 -top-10 absolute -z-10 select-none animate-pulse' src={left_bg} />
      <img className='w-5/12 -right-80 top-44 absolute -z-10 select-none animate-spin' src={right_bg} />
      <div className='z-20 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform'>
        <p className='text-6xl font-bold'>Stay Ahead, Stay</p>
        <p className='text-6xl font-bold'>Informed-Al-Powered</p>
        <div className=''>
          <p className='mt-3 text-xl'>Transforming financial news with Al precision. Get real-time, personalized updates from 10,000+ sources, tailored to your investmentpreferences. Simplify decision-making and stay ahead in the market, effortlessly</p>
        </div>
        <div className='mt-4 flex gap-x-4 justify-center text-white'>
          <input onChange={e => setSearchVal(e.target.value)} value={searchVal}
            className='w-96 px-3 text-black border-black border rounded-md' placeholder='Enter something...' type="text" />
          <div onClick={async _ => {


             const res = await fetchData(searchVal);
             if (res) {
               console.log("res", res);
               setAllData(res);
               addCount(count + 1)
             }
            //const count = readCount()
            //if (count > 2) {
            //  message.info('Exceeded maximum number of times')
            //  return
            //}

            // addCount(count + 1)

          
          }}
            className='w-52 p-3 py-4 rounded-lg bg-blue-600 hover:bg-blue-700 transition-all cursor-pointer' style={{}}>
            Search news
          </div>
        </div>
        <div className='mt-4 text-gray-400'>
          <p className='font-bold'>example</p>
          <div className='flex gap-x-4 justify-center'>
            <p onClick={_ => setSearchVal("can you tell me nvidia‘s stock today?")}
              className='hover:font-bold hover:color-gray-800 transition-all cursor-pointer'>can you tell me nvidia‘s stock today?</p>
            <p onClick={_ => setSearchVal("can you tell me apple‘s stock today?")}
              className='hover:font-bold hover:color-gray-800 transition-all cursor-pointer'>can you tell me apple‘s new today?</p>
          </div>
        </div>
      </div>

      {/* loading */}
      <CSSTransition in={isLoading} timeout={300} classNames="fade" unmountOnExit nodeRef={contentRef}>
        <div className='fixed z-20 top-0 left-0 w-full h-full' style={{ backdropFilter: "blur(20px)" }}>
          <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform' ref={contentRef}>
            <div className='flex justify-center'>
              <div className={"loading"}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
            <p className='mt-2 text-3xl font-bold'>please wait, Analysis in progress...</p>
          </div>
        </div>
      </CSSTransition>

      {/* content */}
      <CSSTransition in={isContent} timeout={300} classNames="fade" unmountOnExit nodeRef={contentRef}>
        <div
          className='fixed z-20 top-0 left-0 w-full h-full overflow-auto' style={{ backdropFilter: "blur(100px)" }}>
          <div className='w-11/12 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform' ref={contentRef}>

            <div>
              <p className='text-center text-2xl font-bold'>Stock</p>
              <div className='w-full text-lg py-4 overflow-auto'>
                <div className='flex gap-x-4 justify-center'>
                  <div className='flex justify-center text-left'>
                    <p className='mr-4 text-left'>close:</p>
                    <p className='text-center text-rose-600'>{allData.stock_data.NVDA.close}</p>
                  </div>
                  <div className='flex justify-center text-left'>
                    <p className='mr-4 text-left'>high:</p>
                    <p className='text-center text-rose-600'>{allData.stock_data.NVDA.high}</p>
                  </div>
                  <div className='flex justify-center text-left'>
                    <p className='mr-4 text-left'>latest date:</p>
                    <p className='text-center text-rose-600'>{allData.stock_data.NVDA["latest date"]}</p>
                  </div>
                  <div className='flex justify-center text-left'>
                    <p className='mr-4 text-left'>low:</p>
                    <p className='text-center text-rose-600'>{allData.stock_data.NVDA.low}</p>
                  </div>
                  <div className='flex justify-center text-left'>
                    <p className='mr-4 text-left'>open:</p>
                    <p className='text-center text-rose-600'>{allData.stock_data.NVDA.open}</p>
                  </div>
                  <div className='flex justify-center text-left'>
                    <p className='mr-4 text-left'>volume:</p>
                    <p className='text-center text-rose-600'>{allData.stock_data.NVDA.volume}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className='mt-4'>
              <p className='text-center text-2xl font-bold'>Report</p>
              <div className='w-full text-lg py-4 overflow-auto h-80'>
                {allData.report}
              </div>
            </div>

            <div>
              <p className='mt-4 text-center text-2xl font-bold'>News</p>
              <div className='w-full text-lg py-4 overflow-auto h-40'>
                {Object.keys(allData.all_news).map(key => (
                  <div className='flex justify-center hover:text-rose-400'
                    key={allData.all_news[key].title}>
                    <Tooltip placement="top" title={allData.all_news[key].summary} arrow={false}>
                      <div title='Open the New'
                        className='truncate text-left hover:underline cursor-pointer py-0.5' style={{ width: "70%" }}>
                        <a href={allData.all_news[key].url} target="_blank">{allData.all_news[key].title}</a>
                      </div>
                    </Tooltip>
                    <div className='ml-4 w-36'>
                      {allData.all_news[key].date}
                    </div>
                    <div className='ml-4 w-36 text-left truncate'>
                      {allData.all_news[key].publisher}
                    </div>
                    {
                      /* <div>
                      {allData.all_news[key].summary}
                      </div> */
                    }
                  </div>
                ))}
              </div>
            </div>

            <div onClick={_ => setIsContent(false)}
              className='mt-4 mx-auto p-2 w-24 text-white rounded-lg bg-blue-600 hover:bg-blue-700 transition-all cursor-pointer' style={{}}>
              Close it
            </div>
          </div>

        </div>
      </CSSTransition>
    </div>
  );
}

export default App;
