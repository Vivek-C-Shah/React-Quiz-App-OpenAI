import React, { useContext, useEffect, useState } from "react";
import DataContext from "../context/dataContext";
import axios from "axios";
import { OpenAI } from "openai";
const key = process.env.REACT_APP_OPENAI_SECRET;

const Result = () => {
  const { showResult, quizs, marks, startOver, answerObject } =
    useContext(DataContext);

  const [openAIResponse, setOpenAIResponse] = useState("");

  useEffect(() => {
    if (showResult) {
      const answerText = JSON.stringify(answerObject);
      console.log(answerText);
      axios
        .post(
          "https://api.openai.com/v1/chat/completions",
        {
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "You are a bot that gives a brief report of the JSON data provided to you. the data contains various questions with there correct answers and the selected answer by the user. you need to generate a report based on the given information to you."
              },
              {
                role: "user",
                content: `${answerText},\n\n Generate a performance Report based on the answers provided above.`
              }
            ]
          },
          {
            headers: {
              Authorization: `Bearer ${key}`,
              "Content-Type": "application/json",
            },
          }
      
        )
        .then(response => {
          setOpenAIResponse(response.data.choices[0].message.content);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, [showResult]);

  console.log(openAIResponse);
  return (
    <section
      className="bg-dark text-white"
      style={{ display: `${showResult ? "block" : "none"}` }}
    >
      <div className="container">
        <div className="row vh-100 align-items-center justify-content-center">
          <div className="col-lg-6">
            <div
              className={`text-light text-center p-5 rounded ${
                marks > (quizs.length * 5) / 2 ? "bg-success" : "bg-danger"
              }`}
            >
              <h1 className="mb-2 fw-bold">
                {marks > (quizs.length * 5) / 2 ? "Awesome!" : "Oops!"}
              </h1>
              <h3 className="mb-3 fw-bold">
                Your score is {marks} out of {quizs.length * 5}
              </h3>
              <p className="mb-3 fs-5">{openAIResponse}</p>
              <button
                onClick={startOver}
                className="btn py-2 px-4 btn-light fw-bold d-inline"
              >
                Start Over
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Result;
