import {
  Stack,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthProvider";
import axios from "axios";
import styles from "./Home.module.css";
// import { Box, TextField } from "@mui/material";

export default function Home() {
  const { isLogged } = useContext(AuthContext);
  const [incidents, setIncidents] = useState([]);
  const [formData, setFormData] = useState({
    description: "",
    state: "",
    priority: "",
  });




  const onDelete = async (sys_id) => {
    try {
      await axios.delete(`http://localhost:3001/api/incidents/${sys_id}`, {
        withCredentials: true,
      });
      setIncidents(incidents.filter((inc) => inc.sys_id !== sys_id));
      alert("Incident deleted successfully");
    } catch (err) {
      console.error("Failed to delete incident:", err);
      alert("Error deleting incident");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:3001/api/incidents",
        {
          // number: 'INC' + formData.incidentId,
          short_description: formData.description,
          state: formData.state,
          priority: formData.priority,
        },
        { withCredentials: true }
      );
      // Add new incident to list
      setIncidents((prev) => [res.data.result,...prev ]);
      setFormData({ description: "", state: "", priority: "" });
      alert("Incident created successfully");
    } catch (err) {
      console.error("Failed to create incident:", err);
      alert("Error creating incident");
    }


  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };



  useEffect(() => {
    async function fetchData() {
      if (isLogged) {
        const incidentList = await axios.get(
          "http://localhost:3001/api/incidents",
          { withCredentials: true }
        );
        setIncidents(incidentList.data.result);
      }
    }

    fetchData();
  }, [isLogged]);

  return (
    <>
      {isLogged && incidents ? (
        <>

          <Stack spacing={3}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <Stack spacing={2} sx={{ width: 400 }}>
                
                <TextField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={1}
                />
                <FormControl fullWidth>
                  <InputLabel>State</InputLabel>
                  <Select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    label="State"
                  >
                    <MenuItem value="New">New</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Resolved">Resolved</MenuItem>
                    <MenuItem value="Closed">Closed</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth required>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    label="Priority"
                  >
                    <MenuItem value={1}>1 - Critical</MenuItem>
                    <MenuItem value={2}>2 - High</MenuItem>
                    <MenuItem value={3}>3 - Medium</MenuItem>
                    <MenuItem value={4}>4 - Low</MenuItem>
                    <MenuItem value={5}>5 - Very Low</MenuItem>
                  </Select>
                </FormControl>


                <Button type="submit" variant="contained">
                  Submit
                </Button>
              </Stack>
            </form>



            <Typography variant="h5">Incident Records:</Typography>

            <Grid container spacing={5} justifyContent={"space-around"}>
              {incidents.map((inc, index) => {
                return (
                  <Grid key={inc.sys_id}>
                    <Card sx={{ width: 300, height: 200 }}>
                      <CardContent>
                        <Typography variant="h6">
                          Incident #: {inc.number}
                        </Typography>
                        <Typography variant="body2">
                          Description: {inc.short_description}
                        </Typography>
                        <Typography variant="body2">
                          State: {inc.state}
                        </Typography>
                        <Typography variant="body2">
                          Priority: {inc.priority}
                        </Typography>
                        <Button
                          sx={{ mt: 1 }}
                          variant="contained"
                          color="success"
                        >
                          Edit
                        </Button>
                        <Button
                          sx={{ mt: 1, mx: 1 }}
                          variant="contained"
                          color="error"
                          onClick={() => onDelete(inc.sys_id)}
                        >
                          Delete
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Stack>
        </>
      ) : (
        <Typography>Please log in</Typography>
      )}
    </>
  );
}