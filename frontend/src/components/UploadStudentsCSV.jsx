import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Alert,
  Input,
} from "@mui/material";
import axiosInstance from "../interceptor";

const UploadStudentsCSV = ({ onBack }) => {
  const [file, setFile] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setSnackbar({
        open: true,
        message: "Please select a CSV file.",
        severity: "error",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axiosInstance.post("/students/import/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSnackbar({
        open: true,
        message: "CSV uploaded successfully!",
        severity: "success",
      });
      setFile(null);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "CSV upload failed.",
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
        <Typography variant="h5" align="center">
          Upload Students via CSV
        </Typography>

        <Input
          type="file"
          inputProps={{ accept: ".csv" }}
          onChange={handleFileChange}
        />

        {snackbar.open && (
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        )}

        <Button type="submit" variant="contained">
          Submit CSV
        </Button>

        <Button
          variant="outlined"
          onClick={onBack}
        >
          Back to Add Student
        </Button>
      </Paper>
    </Box>
  );
};

export default UploadStudentsCSV;
