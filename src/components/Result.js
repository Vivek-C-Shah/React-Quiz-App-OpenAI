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
            model: "gpt-3.5-turbo-0125",
            messages: [
              {
                role: "system",
                content: "You're a psychometric analysis bot, you're task is to analyse the person's psychometry and write a detailed review and feedback on what key areas the participant must improve on to be more productive."
              },
              {
                role: "user",
                content: `Here is the quiz,\n\n${answerText}`
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
              className={`text-light text-center p-5 rounded bg-success`}
            >
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

export default Result