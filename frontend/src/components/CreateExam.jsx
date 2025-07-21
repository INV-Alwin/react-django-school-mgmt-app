import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Alert,
} from "@mui/material";
import axiosInstance from "../interceptor";
import { useNavigate } from "react-router-dom";

const CreateExamForm = () => {
  const { register, handleSubmit, reset } = useForm();
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  useEffect(() => {
    if (snackbar.open) {
      const timer = setTimeout(() => {
        setSnackbar((prev) => ({ ...prev, open: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [snackbar.open]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const onSubmit = async (data) => {
    const payload = {
      title: data.title,
      duration_minutes: parseInt(data.duration_minutes),
      assigned_students: data.assigned_students.split(",").map((s) => s.trim()),
    };

    try {
      const response = await axiosInstance.post("/api/exams/exams/", payload);
      const examId = response.data.id;

      setSnackbar({
        open: true,
        message: "Exam created successfully!",
        severity: "success",
      });

      reset();
      navigate(`/create-questions/${examId}`); // Redirect to question creation
    } catch (error) {
      console.error(error.response?.data || error.message);
      setSnackbar({
        open: true,
        message: "Failed to create exam.",
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", minHeight: "100vh", alignItems: "center", backgroundColor: "#f9f9f9", p: 2 }}>
      <Paper component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 4, width: "100%", maxWidth: 500, borderRadius: 2 }}>
        <Typography variant="h5" align="center">Create New Exam</Typography>

        <TextField label="Title" {...register("title")} fullWidth sx={{ mt: 2 }} />
        <TextField label="Duration (minutes)" type="number" {...register("duration_minutes")} fullWidth sx={{ mt: 2 }} />
        <TextField
          label="Assign Students (Full Names, comma separated)"
          {...register("assigned_students")}
          fullWidth
          multiline
          rows={2}
          sx={{ mt: 2 }}
        />

        {snackbar.open && (
          <Alert severity={snackbar.severity} onClose={handleCloseSnackbar} sx={{ mt: 2 }}>
            {snackbar.message}
          </Alert>
        )}

        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Create Exam
        </Button>
      </Paper>
    </Box>
  );
};

export default CreateExamForm;
