const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const cases = [
  {
    id: 1,
    title: "Chest Pain - 54 y/o",
    summary: "Patient presents with chest pain, BP 90/60...",
    choices: ["ACS", "PE", "Pericarditis", "GERD"],
    correct: "ACS",
    explanation: "Typical ST elevation in anterior leads..."
  },

  {
  id: 2,
  title: "Sudden Shortness of Breath",
  summary: "A 45 y/o woman presents with sudden SOB after a long flight. HR 110, BP 120/80.",
  choices: ["Pneumonia", "Asthma attack", "Pulmonary Embolism", "Panic attack"],
  correct: "Pulmonary Embolism",
  explanation: "Classic risk factors: long flight → DVT → PE."
}
];

app.get('/cases', (req, res) => res.json(cases));
app.post('/submit/:id', (req, res) => {
  const caseId = parseInt(req.params.id);
  const userAnswer = req.body.answer;
  const selectedCase = cases.find(c => c.id === caseId);
  const isCorrect = selectedCase.correct === userAnswer;
  res.json({ correct: isCorrect, explanation: selectedCase.explanation });
});

app.listen(5000, () => console.log(`Server running on port 5000`));
