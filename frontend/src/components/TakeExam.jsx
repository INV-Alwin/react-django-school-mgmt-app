import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../interceptor";

const TakeExam = ({ examId, onSubmitSuccess }) => {
  const id = examId;
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(null);

  useEffect(() => {
    axiosInstance
      .get(`/exams/questions/by-exam/${id}/`)
      .then((res) => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleOptionChange = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = () => {
    const formattedAnswers = Object.entries(answers).map(([qid, opt]) => ({
      question: parseInt(qid),
      selected_option: opt,
    }));

    axiosInstance
      .post("exams/submit/", {
        exam: parseInt(id),
        answers: formattedAnswers,
      })
      .then((res) => {
        setScore(res.data.score);
        setTimeout(() => navigate("/student/dashboard"), 5000);
      })
      .catch((err) => console.error(err));
  };

  if (loading) return <CircularProgress sx={{ m: 5 }} />;

  return (
    <Box
        sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 20px)",
        backgroundColor: "#f4f4f4",
        paddingX: 2,
        }}
    >
    <Paper
    elevation={3}
    sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        padding: 4,
        maxWidth: 500,
        width: "100%",
    }}
    component="form"
    onSubmit={handleSubmit}
    >
      <Typography variant="h4" gutterBottom>
        Take Exam
      </Typography>
      {score !== null ? (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" color="success.main">
            Your Score: {score}
          </Typography>
        </Paper>
      ) : (
        <form onSubmit={(e) => e.preventDefault()}>
          {questions.map((q, index) => (
            <Box key={q.id} mb={3}>
              <FormControl component="fieldset">
                <FormLabel component="legend">
                  {index + 1}. {q.question_text}
                </FormLabel>
                <RadioGroup
                  value={answers[q.id] || ""}
                  onChange={(e) => handleOptionChange(q.id, e.target.value)}
                >
                  {["A", "B", "C", "D"].map((opt) => (
                    <FormControlLabel
                      key={opt}
                      value={opt}
                      control={<Radio />}
                      label={`${opt}: ${q[`option_${opt.toLowerCase()}`]}`}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>
          ))}
          <Button
            type="button"
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={Object.keys(answers).length !== questions.length}
          >
            Submit Exam
          </Button>
        </form>
      )}
      </Paper>
    </Box>
  );
};

export default TakeExam;
