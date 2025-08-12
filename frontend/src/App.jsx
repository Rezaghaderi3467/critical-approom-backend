import { useState, useEffect } from 'react';

export default function App() {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30); // 30 ثانیه زمان

  useEffect(() => {
    fetch('http://localhost:5000/cases')
      .then(res => res.json())
      .then(data => setCases(data));
  }, []);

  // شروع تایمر وقتی که کیس انتخاب شد
  useEffect(() => {
    if (selectedCase) {
      setTimeLeft(30);
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [selectedCase]);

  const submitAnswer = () => {
    fetch(`http://localhost:5000/submit/${selectedCase.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer })
    })
      .then(res => res.json())
      .then(data => setResult(data));
  };

  if (!selectedCase)
    return (
      <div>
        <h1>Critical App-Room</h1>
        {cases.map(c => (
          <button key={c.id} onClick={() => setSelectedCase(c)}>
            {c.title}
          </button>
        ))}
      </div>
    );

  return (
    <div>
      <h2>{selectedCase.title}</h2>
      <p>{selectedCase.summary}</p>
      <p>⏳ Time left: {timeLeft}s</p>
      {selectedCase.choices.map(choice => (
        <label key={choice}>
          <input
            type="radio"
            name="answer"
            value={choice}
            disabled={timeLeft === 0 || result}
            onChange={e => setAnswer(e.target.value)}
          />
          {choice}
        </label>
      ))}
      <br/>
      <button onClick={submitAnswer} disabled={!answer || timeLeft === 0 || result}>
        Submit
      </button>
      {result && (
        <div>
          {result.correct ? "✅ Correct" : "❌ Incorrect"}
          <p>{result.explanation}</p>
        </div>
      )}
    </div>
  );
}
