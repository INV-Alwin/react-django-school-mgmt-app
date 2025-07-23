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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Paper,
} from "@mui/material";

const ViewStudents = () => {
  const [students, setStudents] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [currentUrl, setCurrentUrl] = useState("/students/");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentIdToDelete, setStudentIdToDelete] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null); 

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

  const confirmDelete = (id) => {
    setStudentIdToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/students/${studentIdToDelete}/`);
      setDeleteDialogOpen(false);
      setStudentIdToDelete(null);
      fetchStudents(currentUrl);
    } catch (error) {
      console.error("Failed to delete student", error);
    }
  };

  const handleEdit = (student) => {
    // Flatten user info for easier editing
    setEditingStudent({
      ...student,
      ...student.user,
    });
  };

  const handleEditChange = (e) => {
    setEditingStudent({ ...editingStudent, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      user: {
        first_name: editingStudent.first_name,
        last_name: editingStudent.last_name,
        email: editingStudent.email,
        phone_number: editingStudent.phone_number,
      },
      roll_number: editingStudent.roll_number,
      student_class: editingStudent.student_class,
      date_of_birth: editingStudent.date_of_birth,
      admission_date: editingStudent.admission_date,
      status: editingStudent.status,
      assigned_teacher: editingStudent.assigned_teacher,
    };

    try {
      await axiosInstance.put(`/students/${editingStudent.id}/`, payload);
      setEditingStudent(null);
      fetchStudents(currentUrl);
    } catch (error) {
      console.error("Failed to update student", error);
    }
  };

  if (editingStudent) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>Edit Student</Typography>
        <Paper component="form" onSubmit={handleEditSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 3, maxWidth: 500 }}>
          <TextField label="First Name" name="first_name" value={editingStudent.first_name} onChange={handleEditChange} />
          <TextField label="Last Name" name="last_name" value={editingStudent.last_name} onChange={handleEditChange} />
          <TextField label="Email" name="email" value={editingStudent.email} onChange={handleEditChange} />
          <TextField label="Phone Number" name="phone_number" value={editingStudent.phone_number} onChange={handleEditChange} />
          <TextField label="Roll Number" name="roll_number" value={editingStudent.roll_number} onChange={handleEditChange} />
          <TextField label="Class" name="student_class" value={editingStudent.student_class} onChange={handleEditChange} />
          <TextField type="date" label="Date of Birth" name="date_of_birth" InputLabelProps={{ shrink: true }} value={editingStudent.date_of_birth} onChange={handleEditChange} />
          <TextField type="date" label="Admission Date" name="admission_date" InputLabelProps={{ shrink: true }} value={editingStudent.admission_date} onChange={handleEditChange} />
          <TextField label="Status" name="status" value={editingStudent.status} onChange={handleEditChange} />
          <TextField label="Assigned Teacher" name="assigned_teacher" value={editingStudent.assigned_teacher} onChange={handleEditChange} />
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button type="submit" variant="contained">Save</Button>
            <Button variant="outlined" color="error" onClick={() => setEditingStudent(null)}>Cancel</Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>All Students</Typography>
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
            <TableCell>Actions</TableCell>
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
              <TableCell>
                <Button variant="outlined" color="primary" size="small" onClick={() => handleEdit(student)} sx={{ mr: 1 }}>Edit</Button>
                <Button variant="outlined" color="error" size="small" onClick={() => confirmDelete(student.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
        <Button variant="outlined" disabled={!prevPage} onClick={() => setCurrentUrl(prevPage)}>Previous</Button>
        <Button variant="outlined" disabled={!nextPage} onClick={() => setCurrentUrl(nextPage)}>Next</Button>
      </Box>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this student? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewStudents;
