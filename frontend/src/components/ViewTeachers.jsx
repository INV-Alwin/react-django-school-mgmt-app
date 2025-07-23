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

const ViewTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [currentUrl, setCurrentUrl] = useState("/teachers/");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [teacherIdToDelete, setTeacherIdToDelete] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState(null);

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

  const confirmDelete = (id) => {
    setTeacherIdToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!teacherIdToDelete) return;
    try {
      await axiosInstance.delete(`/teachers/${teacherIdToDelete}/`);
      setDeleteDialogOpen(false);
      setTeacherIdToDelete(null);
      fetchTeachers(currentUrl); // Refresh list
    } catch (error) {
      console.error("Failed to delete teacher", error);
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher({
      ...teacher,
      ...teacher.user,
    });
  };

  const handleEditChange = (e) => {
    setEditingTeacher({ ...editingTeacher, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      user: {
        first_name: editingTeacher.first_name,
        last_name: editingTeacher.last_name,
        email: editingTeacher.email,
        phone_number: editingTeacher.phone_number,
      },
      employee_id: editingTeacher.employee_id,
      subject_specialization: editingTeacher.subject_specialization,
      date_of_joining: editingTeacher.date_of_joining,
      status: editingTeacher.status,
    };

    try {
      await axiosInstance.put(`/teachers/${editingTeacher.id}/`, payload);
      setEditingTeacher(null);
      fetchTeachers(currentUrl);
    } catch (error) {
      console.error("Failed to update teacher", error);
    }
  };

  if (editingTeacher) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>Edit Teacher</Typography>
        <Paper
          component="form"
          onSubmit={handleEditSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            p: 3,
            maxWidth: 500,
          }}
        >
          <TextField label="First Name" name="first_name" value={editingTeacher.first_name} onChange={handleEditChange} />
          <TextField label="Last Name" name="last_name" value={editingTeacher.last_name} onChange={handleEditChange} />
          <TextField label="Email" name="email" value={editingTeacher.email} onChange={handleEditChange} />
          <TextField label="Phone Number" name="phone_number" value={editingTeacher.phone_number} onChange={handleEditChange} />
          <TextField label="Employee ID" name="employee_id" value={editingTeacher.employee_id} onChange={handleEditChange} />
          <TextField label="Subject" name="subject_specialization" value={editingTeacher.subject_specialization} onChange={handleEditChange} />
          <TextField type="date" label="Date of Joining" name="date_of_joining" InputLabelProps={{ shrink: true }} value={editingTeacher.date_of_joining} onChange={handleEditChange} />
          <TextField label="Status" name="status" value={editingTeacher.status} onChange={handleEditChange} />
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button type="submit" variant="contained">Save</Button>
            <Button variant="outlined" color="error" onClick={() => setEditingTeacher(null)}>Cancel</Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>All Teachers</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Employee ID</TableCell>
            <TableCell>Subject</TableCell>
            <TableCell>Date of Joining</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {teachers.map((teacher) => (
            <TableRow key={teacher.id}>
              <TableCell>{teacher.user.first_name} {teacher.user.last_name}</TableCell>
              <TableCell>{teacher.user.email}</TableCell>
              <TableCell>{teacher.user.phone_number}</TableCell>
              <TableCell>{teacher.employee_id}</TableCell>
              <TableCell>{teacher.subject_specialization}</TableCell>
              <TableCell>{teacher.date_of_joining}</TableCell>
              <TableCell>{teacher.status}</TableCell>
              <TableCell>
                <Button variant="outlined" color="primary" size="small" onClick={() => handleEdit(teacher)} sx={{ mr: 1 }}>Edit</Button>
                <Button variant="outlined" color="error" size="small" onClick={() => confirmDelete(teacher.id)}>Delete</Button>
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
            Are you sure you want to delete this teacher? This action cannot be undone.
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

export default ViewTeachers;
