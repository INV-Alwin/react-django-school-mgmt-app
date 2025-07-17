import React, { useEffect, useState } from "react";
import axiosInstance from "../interceptor";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";

const ViewStudents = () => {
  const [students, setStudents] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [currentUrl, setCurrentUrl] = useState("/students/");

  useEffect(() => {
    fetchStudents(currentUrl);
  }, [currentUrl]);

  const fetchStudents = async (url) => {
    try {
      const response = await axiosInstance.get(url);
      setStudents(response.data.results);
      setNextPage(response.data.next);
      setPrevPage(response.data.previous);
    } catch (error) {
      console.error("Failed to fetch students", error);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        All Students
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Roll Number</TableCell>
            <TableCell>Class</TableCell>
            <TableCell>Date of Birth</TableCell>
            <TableCell>Admission Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Assigned Teacher</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.user.first_name} {student.user.last_name}</TableCell>
              <TableCell>{student.user.email}</TableCell>
              <TableCell>{student.user.phone_number}</TableCell>
              <TableCell>{student.roll_number}</TableCell>
              <TableCell>{student.student_class}</TableCell>
              <TableCell>{student.date_of_birth}</TableCell>
              <TableCell>{student.admission_date}</TableCell>
              <TableCell>{student.status}</TableCell>
              <TableCell>{student.assigned_teacher}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
        <Button
          variant="outlined"
          disabled={!prevPage}
          onClick={() => setCurrentUrl(prevPage)}
        >
          Previous
        </Button>
        <Button
          variant="outlined"
          disabled={!nextPage}
          onClick={() => setCurrentUrl(nextPage)}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default ViewStudents;
