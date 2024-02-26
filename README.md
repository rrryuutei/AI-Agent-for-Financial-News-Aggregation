For a demonstration, please see our demo video.https://rrryuutei.github.io/AI-Agent-for-Financial-News-Aggregation/

What's Under the Hood?
Note: GPT-4 does not know about events after September 2021.

Our AI agent leverages external tools, such as APIs, to access the most recent financial news and data. This approach allows us to inject the latest information directly into the model. Here's an overview of the process:

Planning: Identify the most relevant stocks to investigate.
Retrieving: Utilize APIs to fetch the latest data and news regarding these stocks.
Analyzing: Analyze the recent data and news, reflect on the initial planning, and gather more data to capture the latest trends.
Summarizing: Summarize the findings in a well-crafted response, based on all the relevant news and data.
Technical Details
Skills: Python, Flask, React.js, Vite.js, Node.js, Websocket

Back-end
Integration: Combine OpenAI API and YahooFinance API to retrieve news and stock market data for summarization and categorization.
Configuration: Use Flask for Cross-Origin Resource Sharing (CORS) setup to securely request resources from different origins.
Front-end
Data Fetching: Perform concurrent data fetching in React, ensuring progress tracking and error handling through state management.
Event Listening & State Updates: Utilize wheel event listening in React to dynamically adjust content visibility and manage state updates responsively.
For a demonstration, please see our demo video.

