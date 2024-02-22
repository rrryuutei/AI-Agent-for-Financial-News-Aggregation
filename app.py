from flask import Flask, request, render_template
from agent import Agent



app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        user_input = request.form['user_input']
        # Your Python script's logic here, using user_input and making API calls
        agent = Agent()
        response = agent.execute(user_input)
        return render_template('response.html', response=response['report'])
    return render_template('index.html')  # A form for user input



if __name__ == '__main__':
    app.run(debug=True)
