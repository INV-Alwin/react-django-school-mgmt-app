import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import UploadStudentsCSV from "../components/UploadStudentsCSV";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Alert,
  MenuItem,
} from "@mui/material";
import axiosInstance from "../interceptor";

const AddStudentForm = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const [showCSV, setShowCSV] = useState(false); 

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

  if (showCSV) {
    return <UploadStudentsCSV onBack={() => setShowCSV(false)} />;
  }

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

        <TextField
          label="First Name"
          {...register("first_name", { required: "First name is required" })}
          error={!!errors.first_name}
          helperText={errors.first_name?.message}
        />
        <TextField label="Last Name" {...register("last_name",{ required: "Last name is required" })} 
          error={!!errors.last_name}
          helperText={errors.last_name?.message} 
        />
        <TextField label="Email" {...register("email",{ required: "Email is required" })} 
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField label="Phone Number" {...register("phone_number",{ required: "Phone Number is required" })} 
          error={!!errors.phone_number}
          helperText={errors.phone_number?.message}
        />
        <TextField label="Roll Number" {...register("roll_number",{ required: "Roll Number is required" })} 
          error={!!errors.roll_number}
          helperText={errors.roll_number?.message}
        />
        <TextField label="Class" {...register("student_class",{ required: "Class is required" })} 
          error={!!errors.student_class}
          helperText={errors.student_class?.message}
        />
        <TextField
          type="date"
          label="Date of Birth"
          InputLabelProps={{ shrink: true }}
          {...register("date_of_birth",{ required: "Date of Birth is required" })}
          error={!!errors.date_of_birth}
          helperText={errors.date_of_birth?.message}
        />
        <TextField
          type="date"
          label="Date of Admission"
          InputLabelProps={{ shrink: true }}
          {...register("admission_date",{ required: "Date of Admission is required" })}
          error={!!errors.admission_date}
          helperText={errors.admission_date?.message}
        />
        <TextField
          select
          label="Status"
          defaultValue="active"
          {...register("status", { required: "Status is required" })}
          error={!!errors.status}
          helperText={errors.status?.message}
          fullWidth
        >
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </TextField>
        <TextField label="Assigned Teacher" {...register("assigned_teacher", { required: "Assigned Teacher is required" })} 
          error={!!errors.assigned_teacher}
          helperText={errors.assigned_teacher?.message}
        />

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

        <Button
          variant="outlined"
          onClick={() => setShowCSV(true)} 
        >
          Upload CSV
        </Button>
      </Paper>
    </Box>
  );
};

export default AddStudentForm;
