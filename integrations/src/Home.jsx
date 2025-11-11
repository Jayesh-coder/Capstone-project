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

export default function Home() {
  const { isLogged } = useContext(AuthContext);
  const [incidents, setIncidents] = useState([]);
  const [formData, setFormData] = useState({
    description: "",
    state: "",
    priority: "",
  });
  const [editingId, setEditingId] = useState(null); // track sys_id being edited

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
      if (editingId) {
        // UPDATE existing incident
        const res = await axios.put(
          `http://localhost:3001/api/incidents/${editingId}`,
          {
            short_description: formData.description,
            state: formData.state,
            // priority is NOT updated when editing
          },
          { withCredentials: true }
        );

        // Handle both possible response structures from ServiceNow
        const updatedIncident = res.data.result || res.data;
        
        setIncidents((prev) =>
          prev.map((inc) =>
            inc.sys_id === editingId 
              ? { ...inc, ...updatedIncident }
              : inc
          )
        );
        alert("Incident updated successfully");
      } else {
        // CREATE new incident
        const res = await axios.post(
          "http://localhost:3001/api/incidents",
          {
            short_description: formData.description,
            state: formData.state,
            priority: Number(formData.priority), // Convert to number for ServiceNow
          },
          { withCredentials: true }
        );
        setIncidents((prev) => [res.data.result, ...prev]);
        alert("Incident created successfully");
      }

      // reset form
      setFormData({ description: "", state: "", priority: "" });
      setEditingId(null);
    } catch (err) {
      console.error("Failed to save incident:", err);
      const errorMsg = err.response?.data?.error || "Error saving incident";
      alert(errorMsg);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Keep priority as string for Select compatibility
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onEdit = (incident) => {
    console.log("Editing incident:", incident);
    console.log("Priority value:", incident.priority, "Type:", typeof incident.priority);
    
    setFormData({
      description: incident.short_description,
      state: incident.state,
      // Convert priority to string for Select compatibility
      priority: incident.priority !== undefined && incident.priority !== null
        ? String(incident.priority)
        : "",
    });
    setEditingId(incident.sys_id);
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
              <FormControl fullWidth required={!editingId}>
                <InputLabel shrink={formData.priority !== "" && !editingId}>Priority</InputLabel>
                <Select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  label="Priority"
                  notched={formData.priority !== "" && !editingId}
                  disabled={editingId !== null}
                >
                  <MenuItem value="1">1 - Critical</MenuItem>
                  <MenuItem value="2">2 - High</MenuItem>
                  <MenuItem value="3">3 - Medium</MenuItem>
                  <MenuItem value="4">4 - Low</MenuItem>
                  <MenuItem value="5">5 - Very Low</MenuItem>
                </Select>
              </FormControl>

              <Stack direction="row" spacing={2}>
                <Button type="submit" variant="contained">
                  {editingId ? "Update Incident" : "Create Incident"}
                </Button>
                {editingId && (
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setFormData({ description: "", state: "", priority: "" });
                      setEditingId(null);
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </Stack>
            </Stack>
          </form>

          <Typography variant="h5">Incident Records:</Typography>

          <Grid container spacing={5} justifyContent={"space-around"}>
            {incidents.map((inc) => (
              <Grid key={inc.sys_id}>
                <Card sx={{ width: 300, height: 200 }}>
                  <CardContent>
                    <Typography variant="h6">
                      Incident #: {inc.number}
                    </Typography>
                    <Typography variant="body2">
                      Description: {inc.short_description}
                    </Typography>
                    <Typography variant="body2">State: {inc.state}</Typography>
                    <Typography variant="body2">
                      Priority: {inc.priority}
                    </Typography>
                    <Button
                      sx={{ mt: 1 }}
                      variant="contained"
                      color="success"
                      onClick={() => onEdit(inc)}
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
            ))}
          </Grid>
        </Stack>
      ) : (
        <Typography>Please log in</Typography>
      )}
    </>
  );
}