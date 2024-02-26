from flask import Flask, jsonify, request
from agent import Agent
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/": {"origins": "*", "methods": ["GET", "POST"]}})

# add a new route handling function to fetch stock data
@app.route('/fetch-stock-data', methods=['POST'])
def fetch_stock_data():
    user_input = request.json['user_input']
    print("user_input"+user_input)
    agent = Agent(user_input)
    response = agent.retrieve_stock_data()
    # return stock data
    return jsonify({
        'stock_data': response['stock data'],
        'all_news': response['all news'] 
    })

# add a new route handling function to fetch generated answer
@app.route('/fetch-generated-answer', methods=['POST'])
def fetch_generated_answer():
    user_input = request.json['user_input']
    agent = Agent(user_input)
    # response = agent.retrieve_stock_data()
    answer = agent.generate_answer()
    # return generated answer
    return jsonify({
        'report': answer
        # 
    })

if __name__ == '__main__':
    app.run(debug=True)
