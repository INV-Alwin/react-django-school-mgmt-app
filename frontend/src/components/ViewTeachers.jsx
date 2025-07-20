import React, { useEffect, useState } from "react";
import axiosInstance from "../interceptor";
import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button } from "@mui/material";

const ViewTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [currentUrl, setCurrentUrl] = useState("/teachers/");

  useEffect(() => {
    fetchTeachers(currentUrl);
  }, [currentUrl]);

  const fetchTeachers = async (url) => {
    try {
      const response = await axiosInstance.get(url);
      setTeachers(response.data.results);
      setNextPage(response.data.next);
      setPrevPage(response.data.previous);
    } catch (error) {
      console.error("Failed to fetch teachers", error);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        All Teachers
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Subject</TableCell>
            <TableCell>Employee ID</TableCell>
            <TableCell>Date of Joining</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {teachers.map((teacher) => (
            <TableRow key={teacher.id}>
              <TableCell>{teacher.user.first_name} {teacher.user.last_name}</TableCell>
              <TableCell>{teacher.user.email}</TableCell>
              <TableCell>{teacher.user.phone_number}</TableCell>
              <TableCell>{teacher.subject_specialization}</TableCell>
              <TableCell>{teacher.employee_id}</TableCell>
              <TableCell>{teacher.date_of_joining}</TableCell>
              <TableCell>{teacher.status}</TableCell>
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

export default ViewTeachers;
