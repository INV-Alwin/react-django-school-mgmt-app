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

const AddStudentForm = () => {
  const { register, handleSubmit, reset } = useForm();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

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
      user: {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone_number: data.phone_number,
      },
      roll_number: data.roll_number,
      student_class: data.student_class,
      date_of_birth: data.date_of_birth,
      admission_date: data.admission_date,
      status: data.status,
      assigned_teacher: data.assigned_teacher,
    };

    try {
      await axiosInstance.post("/students/", payload);
      setSnackbar({
        open: true,
        message: "Student added successfully!",
        severity: "success",
      });
      reset();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to add student.",
        severity: "error",
      });
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 20px)",
        backgroundColor: "#f9f9f9",
        overflowY: "auto",
        paddingX: 2,
      }}
    >
      <Paper
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        elevation={3}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "100%",
          maxWidth: 500,
          padding: 4,
          borderRadius: 2,
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h5" align="center">
          Add New Student
        </Typography>

        <TextField label="First Name" {...register("first_name")} />
        <TextField label="Last Name" {...register("last_name")} />
        <TextField label="Email" {...register("email")} />
        <TextField label="Phone Number" {...register("phone_number")} />
        <TextField label="Roll Number" {...register("roll_number")} />
        <TextField label="Class" {...register("student_class")} />
        <TextField
          type="date"
          label="Date of Birth"
          InputLabelProps={{ shrink: true }}
          {...register("date_of_birth")}
        />
                <TextField
          type="date"
          label="Date of Admission"
          InputLabelProps={{ shrink: true }}
          {...register("admission_date")}
        />
        <TextField label="Status" defaultValue="active" {...register("status")} />
        <TextField label="Assigned Teacher" {...register("assigned_teacher")} />
        
        {snackbar.open && (
          <Alert
            severity={snackbar.severity}
            onClose={handleCloseSnackbar}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        )}

        <Button type="submit" variant="contained">
          Submit
        </Button>
      </Paper>
    </Box>
  );
};

export default AddStudentForm;
