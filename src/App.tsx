import { useState } from "react";

import { useMachine } from "@xstate/react";

import reactLogo from "./assets/react.svg";
import "./App.css";

import { redditMachine } from "./lib/xstate";

const subreddits = ["frontend", "reactjs", "vuejs"];

function App() {
  const [current, send] = useMachine(redditMachine);

  const { subreddit, posts } = current.context;

  return (
    <div className="App">
      <img src={reactLogo} className="logo react" alt="React logo" />
      <h1>Xstate x Reddit</h1>
      <div className="select">
        <select
          onChange={(e) => {
            send({ type: "SELECT", name: e.target.value });
          }}
        >
          {subreddits.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </div>
      <div className="card">
        <h1>{current.matches("idle") ? "Select a subreddit" : subreddit}</h1>
        {current.matches({ selected: "loading" }) && <div>Loading...</div>}
        {current.matches({ selected: "loaded" }) && (
          <ul>
            {posts?.map((post) => (
              <li key={post.title}>{post.title}</li>
            ))}
          </ul>
        )}
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
