import React from "react";
import {
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import { Menu as MenuIcon, Dashboard, Logout } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

const AppLayout = ({ children, activeView, setActiveView, onLogout }) => {
  const [open, setOpen] = React.useState(true);
  const { logout } = useAuth(); 
  const navigate = useNavigate();
  const role = localStorage.getItem("role"); 

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer}
            sx={{ marginRight: "16px" }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            School Management System
          </Typography>

   
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ListItem button onClick={onLogout} sx={{ color: "inherit", padding: 0 }}>
              <ListItemIcon sx={{ color: "inherit", minWidth: "auto", marginRight: 1 }}>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: open
            ? { xs: 180, sm: 220, md: 240 } 
            : 0,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          transition: 'width 0.3s',
          "& .MuiDrawer-paper": {
            width: open
              ? { xs: 180, sm: 220, md: 240 }
              : 0,
            transition: 'width 0.3s',
            boxSizing: "border-box",
            overflowX: 'hidden',
          },
        }}
      >
        <Toolbar />
        <List>
          <ListItem button onClick={() => setActiveView("dashboard")}>
            <ListItemIcon>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>

          {role === "admin" && (
            <>
              <ListItem button onClick={() => setActiveView("addTeacher")}>
                <ListItemText primary="Add Teacher" />
              </ListItem>
              <ListItem button onClick={() => setActiveView("addStudent")}>
                <ListItemText primary="Add Student" />
              </ListItem>
              <ListItem button onClick={() => setActiveView("viewTeachers")}>
                <ListItemText primary="View Teachers" />
              </ListItem>
              <ListItem button onClick={() => setActiveView("viewStudents")}>
                <ListItemText primary="View Students" />
              </ListItem>
            </>
          )}

          {role === "teacher" && (
            <>
              <ListItem button onClick={() => setActiveView("viewStudents")}>
                <ListItemText primary="View Students" />
              </ListItem>
              <ListItem button onClick={() => setActiveView("createExam")}>
                <ListItemText primary="Create Exam" />
              </ListItem>
            </>
          )}

          {role === "student" && (
            <>
              <ListItem button onClick={() => setActiveView("Exam")}>
                <ListItemText primary="Exam" />
              </ListItem>
            </>
          )}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={(theme) => ({
          flexGrow: 1,
          padding: 3,
          marginLeft: open ? `${drawerWidth}px` : 0,
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        })}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default AppLayout;
