from flask import Flask, jsonify, request, render_template
from agent import Agent
from flask_cors import CORS, cross_origin


app = Flask(__name__)
CORS(app, resources={r"/": {"origins": "*", "methods": ["GET", "POST"]}})

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        user_input = request.form['user_input']
        # Your Python script's logic here, using user_input and making API calls
        agent = Agent(user_input)
        response = agent.retrieve_stock_data()
        answer = agent.generate_answer()

        # return render_template('response.html', response=response['report'])
        return jsonify({
            'report': answer,
            'stock_data': response['stock data'],
            'all_news': response['all news']
        })
    return render_template('index.html')  # A form for user input



if __name__ == '__main__':
    app.run(debug=True)
