import React, { useEffect, useState } from "react";
import axiosInstance from "../interceptor";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const StudentExams = ({ onStartExam }) => {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("exams/assigned/")
      .then((res) => setExams(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Assigned Exams
      </Typography>
      <Grid container spacing={2}>
        {exams.map((exam) => (
          <Grid item xs={12} md={6} lg={4} key={exam.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{exam.title}</Typography>
                <Typography>Duration: {exam.duration_minutes} mins</Typography>
                <Typography>
                  Status:{" "}
                  {exam.submitted ? (
                    <>
                      <strong>Submitted</strong>
                      <br />
                      Marks: {exam.marks_obtained}
                    </>
                  ) : (
                    "Not Submitted"
                  )}
                </Typography>
                {!exam.submitted && (
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={() => onStartExam(exam.id)}
                  >
                    Take Exam
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default StudentExams;
