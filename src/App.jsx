import { useState, useRef } from 'react';
import left_bg from './assets/left.png';
import right_bg from './assets/right.png';
import { CSSTransition } from 'react-transition-group';

import { addCount, readCount } from "./util/index"

import { message, Button, Tooltip, Modal, Popover } from 'antd';
const { confirm } = Modal;
function App() {
  const [searchVal, setSearchVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isContent, setIsContent] = useState(true);

  const [stockAndNew, setStockAndNew] = useState('');
  const [report, setReport] = useState('');

  const contentRef = useRef(null);

  const fetchData = async (userInput) => {
    try {
      setIsLoading(true);

      fetch('/dev/fetch-generated-answer', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ user_input: userInput })
      }).then(async res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await res.json();
        console.log("fetch-generated-answer", data);

        setReport(data.report)

        setIsLoading(false);
        setIsContent(true);

      })

      fetch('/dev/fetch-stock-data', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ user_input: userInput })
      }).then(async res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await res.json();
        console.log("response_stock", data);

        setStockAndNew(data)

        setIsLoading(false);
        setIsContent(true);
      })

    } catch (error) {
      setIsLoading(false);
      message.error(error.message)
      console.error('There was a problem with the fetch operation:', error.message);
    }
  };

  // Object.keys(allData.stock_data).map(key => console.log("key", allData.stock_data[key]))


  document.body.addEventListener('wheel', ({ deltaY }) => {
    if (deltaY < 0) setIsContent(false)
    else setIsContent(true)
  })


  return (
    <div className="fixed w-full h-full top-0 left-0 overflow-hidden text-center">

      <header className='fixed flex justify-end py-2 px-3 top-0 left-0 w-full bg-opacity-30 shadow-sm'>
        <div className='flex gap-x-3'>
          <Button onClick={_ => confirm({
            title: 'Contact Us',
            content: 'Please emain Nora Liu, noraliu2023@gmail.com </a>',
            onOk() {
              console.log('OK');
            },
            onCancel() {
              console.log('Cancel');
            },
            okButtonProps: {
              type: "primary",
              style: { "color": "black" }
            },
            cancelButtonProps: {
              type: "text"
            }
          })}
            type="dashed" size="large" className=' text-black '>Contact</Button>
          <Button onClick={_=>{
            message.info('Click on Finnews AI')
        }}
            type="primary" size="large" className=' bg-blue-400'>Finnews AI</Button>
        </div>
      </header >

      <img className='w-4/12 -left-72 top-44 absolute -z-10 select-none animate-bounce' src={left_bg} />
      <img className='w-3/12 left-96 -top-10 absolute -z-10 select-none animate-pulse' src={left_bg} />
      <img className='w-5/12 -right-80 top-44 absolute -z-10 select-none animate-spin' src={right_bg} />
      <div className='z-20 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform'>
        <p className='text-6xl font-bold'>Stay Ahead, Stay Informed</p>
        <p className='text-6xl font-bold'>Al-Powered</p>
        <div className=''>
          <p className='mt-3 text-xl'>Transforming financial news with Al precision. Get real-time, personalized updates from 10,000+ sources, tailored to your investmentpreferences. Simplify decision-making and stay ahead in the market, effortlessly.</p>
        </div>
        <div className='mt-4 flex gap-x-4 justify-center text-white'>
          <input onChange={e => setSearchVal(e.target.value)} value={searchVal}
            className='w-96 px-3 text-black border-black border rounded-md' placeholder='Enter something...' type="text" />
          <div onClick={async _ => {
            const count = readCount()
            if (count > 40) {
              message.info('Exceeded maximum number of times')
              return
            }
            try {
              await fetchData(searchVal);
              addCount(count + 1)
            } catch (error) {
              console.error(error)
            }

          }}
            className='w-52 p-3 py-4 rounded-lg bg-blue-600 hover:bg-blue-700 transition-all cursor-pointer' style={{}}>
            Get Insights!
          </div>
        </div>
        <div className='mt-4 text-gray-400'>
          {/* <p className='font-bold'>Example</p> */}

          <div className='flex gap-x-4 justify-center'>
            <p onClick={_ => setSearchVal("Can you analyze Tesla’s potential in the stock market?")}
              className='hover:font-bold hover:color-gray-800 transition-all cursor-pointer'>Can you analyze Tesla’s potential in the stock market as of today?</p>
            <p onClick={_ => setSearchVal("What companies benefit most from the AI revolutionas of today<?")}
              className='hover:font-bold hover:color-gray-800 transition-all cursor-pointer'>What companies benefit most from the AI revolution?
              </p>
          </div>
        </div>

        {
          stockAndNew || report !== ''
            ?
            <Popover content={"Scroll down to view results"} title="Click to view the results just Showd!">
              <div onClick={_ => setIsContent(true)}
                className='animate-bounce w-14 h-14 mx-auto text-gray-700 rounded-full flex justify-center items-center text-4xl font-bold mt-20 p-4 bg-black bg-opacity-10 cursor-pointer hover:text-blue-700'>
                <p className='select-none'>↓</p>
              </div>
            </Popover>
            :
            ''
        }

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
            <p className='mt-2 text-3xl font-bold'>Please wait, analysis in progress...</p>
          </div>
        </div>
      </CSSTransition>

      {/* content */}
      {
        report !== '' || stockAndNew !== '' ?
          <div onWheel={e => e.stopPropagation()}
            className='fixed z-20 top-0 left-0 w-full h-full overflow-auto transition-all duration-500'
            style={
              {
                backdropFilter: "blur(100px)",
                transform: isContent ? '' : 'translateY(100%)'
              }
            }>
            <div className='w-11/12 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform' ref={contentRef}>

              <div>
                <p className='text-center text-2xl font-bold'>Stock</p>
                <div className='w-full text-lg py-3 overflow-auto'>
                  <div className=''>
                    {
                      Object.keys(stockAndNew.stock_data).length !== 0
                        ?
                        Object.keys(stockAndNew.stock_data).map(key => (
                          <div key={key} className='mt-1'>
                            <p>{key}</p>
                            <div className='flex gap-x-4 justify-center'>
                              <div className='flex justify-center text-left'>
                                <p className='mr-4 text-left '>Date:</p>
                                <p className='text-center text-rose-600'>{stockAndNew.stock_data[key]["latest_date"]}</p>
                               
                              </div>
                              <div className='flex gap-x-1 justify-center text-left'>
                                <p className='mr-4 text-left '>High:</p>
                                <p className='text-center text-rose-600'>{stockAndNew.stock_data[key].high}</p>
                              </div>
                              <div className='flex gap-x-1 justify-center text-left'>
                               <p className='mr-4 text-left '>Low:</p>
                                <p className='text-center text-rose-600'>{stockAndNew.stock_data[key].low}</p>
                              </div>
                              <div className='flex gap-x-1 justify-center text-left'>
                               <p className='mr-4 text-left '>Open:</p>
                                <p className='text-center text-rose-600'>{stockAndNew.stock_data[key].open}</p>
                              </div>
                              <div className='flex gap-x-1 justify-center text-left'>
                              <p className='mr-4 text-left '>Close:</p>
                                <p className='text-center text-rose-600'>{stockAndNew.stock_data[key].close}</p>
                              </div>
                              <div className='flex gap-x-1 justify-center text-left'>
                                <p className='mr-4 text-left'>Volume:</p>
                                <p className='text-center text-rose-600'>{stockAndNew.stock_data[key].volume}</p>
                              </div>
                            </div>
                          </div>
                        ))
                        : 'No Data'
                    }
                  </div>
                </div>
              </div>

              <div>
                <p className='mt-4 text-center text-2xl font-bold'>News</p>
                <div className='w-full text-lg py-4 overflow-auto h-40'>
                  {
                    stockAndNew?.all_news?.length !== 0
                      ?
                      stockAndNew?.all_news?.map(item => (
                        <div className='flex justify-center hover:text-rose-400'
                          key={item.title}>
                          <Tooltip placement="top" title={item.summary} arrow={false}>
                            <div title='Open the New'
                              className='truncate text-left hover:underline cursor-pointer py-0.5' style={{ width: "70%" }}>
                              <a href={item.url} target="_blank">{item.title}</a>
                            </div>
                          </Tooltip>
                          <div className='ml-4 w-36'>
                            {item.date}
                          </div>
                          <div className='ml-4 w-36 text-left truncate'>
                            {item.publisher}
                          </div>
                        </div>
                      ))
                      :
                      'No Data'
                  }
                </div>
              </div>

              <div className='mt-4'>
                <p className='text-center text-2xl font-bold'>Summary</p>
                <div className='w-full text-lg py-4 overflow-auto h-80'>
                  {
                    report ? report : 'Loading...'
                  }
                </div>
              </div>

              <div onClick={_ => setIsContent(false)}
                className='mt-4 mx-auto p-2 w-24 text-white rounded-lg bg-blue-600 hover:bg-blue-700 transition-all cursor-pointer' style={{}}>
                Close it
              </div>
            </div>
          </div>
          :
          ''
      }
    </div >
  );
}

export default App;
