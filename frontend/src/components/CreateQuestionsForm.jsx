import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Alert,
} from "@mui/material";
import { useParams } from "react-router-dom";
import axiosInstance from "../interceptor";

const CreateQuestionsForm = ({ examId }) => {
  //const { examId } = useParams();
  const { register, handleSubmit, control, reset } = useForm({
    defaultValues: {
      questions: Array(5).fill({ text: "", option1: "", option2: "", option3: "", option4: "", correct_option: 1 }),
    },
  });

  const { fields } = useFieldArray({ control, name: "questions" });
  const [snackbar, setSnackbar] = React.useState({ open: false, message: "", severity: "success" });

const onSubmit = async (data) => {
  console.log("examId raw:", examId);
  console.log("Parsed examId:", parseInt(examId));
  const optionLetter = ["A", "B", "C", "D"];
  const exam_id = parseInt(examId);
  const payload = data.questions.map((q) => ({
    exam: exam_id,
    question_text: q.text,
    option_a: q.option1,
    option_b: q.option2,
    option_c: q.option3,
    option_d: q.option4,
    correct_option: optionLetter[parseInt(q.correct_option) - 1],
  }));

  try {
    await axiosInstance.post("exams/questions/bulk_create/", payload);
    setSnackbar({ open: true, message: "Questions submitted!", severity: "success" });
    reset();
  } catch (error) {
    setSnackbar({ open: true, message: "Submission failed", severity: "error" });
    console.error(error.response?.data || error.message);
  }
};

  return (
    <Box sx={{ display: "flex", justifyContent: "center", p: 2, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Paper component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 4, width: "100%", maxWidth: 700 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Create Questions for Exam #{examId}
        </Typography>

        {fields.map((field, index) => (
          <Box key={field.id} sx={{ mb: 4, p: 2, border: "1px solid #ddd", borderRadius: 2 }}>
            <Typography variant="subtitle1">Question {index + 1}</Typography>
            <TextField fullWidth label="Question Text" {...register(`questions.${index}.text`)} sx={{ mt: 1 }} />
            <TextField fullWidth label="Option 1" {...register(`questions.${index}.option1`)} sx={{ mt: 1 }} />
            <TextField fullWidth label="Option 2" {...register(`questions.${index}.option2`)} sx={{ mt: 1 }} />
            <TextField fullWidth label="Option 3" {...register(`questions.${index}.option3`)} sx={{ mt: 1 }} />
            <TextField fullWidth label="Option 4" {...register(`questions.${index}.option4`)} sx={{ mt: 1 }} />
            <TextField
              fullWidth
              type="number"
              label="Correct Option (1-4)"
              {...register(`questions.${index}.correct_option`)}
              sx={{ mt: 1 }}
            />
          </Box>
        ))}

        {snackbar.open && (
          <Alert severity={snackbar.severity} sx={{ mt: 2 }}>
            {snackbar.message}
          </Alert>
        )}

        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Submit Questions
        </Button>
      </Paper>
    </Box>
  );
};

export default CreateQuestionsForm;
