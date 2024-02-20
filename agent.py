from openai import OpenAI
from flask import Flask, request, render_template



client = OpenAI()


class Agent:

    def __init__(self) -> None:
        self.gpt_model = "gpt-4-turbo-preview"
        self.messages = [
                {"role": "system", "content": "You are a intelligent financial assistant. You are an expert in selecting and summarizing financial news to provide deep insights."},
            ]
        


    def take_user_input(self, query_message):
        # take in a query message from user, and update the message history
        self.messages.append({"role": "user", "content": query_message})



    def call_openai(self):
        # call OpenAI API with the current message history in self.messages

        completion = client.chat.completions.create(
            model = self.gpt_model,
            messages = self.messages
            )
        response = completion.choices[0].message.content

        # update message history with GPT response
        self.messages.append({"role": "asistant", "content": response})

        return response
    

    # def agent_choice(self, ):



