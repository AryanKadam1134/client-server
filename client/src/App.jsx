import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [jokes, setJokes] = useState(null);

  const fetchJokes = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/app/jokes", {
        params: {
          joke: 1,
        },
      });

      setJokes(res.data);
      console.log("jokes: ", res.data);
    } catch (error) {
      console.error("Error fetching jokes: ", error);
    }
  };

  useEffect(() => {
    fetchJokes();
  }, []);

  return (
    <div>
      {jokes?.map((joke, idx) => (
        <div key={idx}>{joke?.joke}</div>
      ))}
    </div>
  );
}

export default App;
