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

const AddTeacherForm = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

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
      subject_specialization: data.subject_specialization,
      employee_id: data.employee_id,
      date_of_joining: data.date_of_joining,
      status: data.status,
    };

    try {
      await axiosInstance.post("/teachers/", payload);
      setSnackbar({
        open: true,
        message: "Teacher added successfully!",
        severity: "success",
      });
      reset();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to add teacher.",
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
          Add New Teacher
        </Typography>

        <TextField label="First Name" {...register("first_name", { required: "First name is required" })}
        
        />
        <TextField label="Last Name" {...register("last_name")} />
        <TextField label="Email" {...register("email")} />
        <TextField label="Phone Number" {...register("phone_number")} />
        <TextField label="Subject Specialization" {...register("subject_specialization")} />
        <TextField label="Employee ID" {...register("employee_id")} />
        <TextField
          type="date"
          label="Date of Joining"
          InputLabelProps={{ shrink: true }}
          {...register("date_of_joining")}
        />
        <TextField label="Status" defaultValue="active" {...register("status")} />
        
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

export default AddTeacherForm;
