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

      {/* ✅ SINGLE AppBar */}
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
          <Typography variant="h6" noWrap component="div">
            School Management System
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
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
            </>
          )}

          <ListItem button onClick={onLogout}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          padding: 3,
          marginLeft: open ? `${drawerWidth}px` : 0,
          transition: "margin 0.3s",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default AppLayout;
