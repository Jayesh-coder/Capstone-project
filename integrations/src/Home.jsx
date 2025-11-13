import {
  Stack,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Divider,
  Box,
  Chip,
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
    impact: "",
    urgency: "",
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
            // update impact and urgency when editing
            impact: Number(formData.impact),
            urgency: Number(formData.urgency),
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
            impact: Number(formData.impact), // Convert to number for ServiceNow
            urgency: Number(formData.urgency),
          },
          { withCredentials: true }
        );
        setIncidents((prev) => [res.data.result, ...prev]);
        alert("Incident created successfully");
      }

  // reset form
  setFormData({ description: "", state: "", impact: "", urgency: "" });
      setEditingId(null);
    } catch (err) {
      console.error("Failed to save incident:", err);
      const errorMsg = err.response?.data?.error || "Error saving incident";
      alert(errorMsg);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  
  const normalizeLevel = (val) => {
    if (val === undefined || val === null) return "";
    
    if (typeof val === "object") {
      if (val.value !== undefined) return String(val.value);
      if (val.display_value !== undefined) {
        const dv = String(val.display_value).toLowerCase();
        if (dv.includes("high")) return "1";
        if (dv.includes("medium")) return "2";
        if (dv.includes("low")) return "3";
      }
      return "";
    }
    
    if (!Number.isNaN(Number(val))) return String(Number(val));
    
    const s = String(val).toLowerCase();
    if (s.includes("high")) return "1";
    if (s.includes("medium")) return "2";
    if (s.includes("low")) return "3";
    return "";
  };

  const onEdit = (incident) => {
    setFormData({
      description: incident.short_description || "",
      state: incident.state || "",
      impact: normalizeLevel(incident.impact),
      urgency: normalizeLevel(incident.urgency),
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
        <Stack spacing={4} className={styles.container}>
          {/* Form Section */}
          <Paper elevation={3} component="form" onSubmit={handleSubmit} className={styles.formPaper}>
            <Typography variant="h6" className={styles.formTitle}>
              {editingId ? "Edit Incident" : "Create New Incident"}
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  fullWidth
                  variant="outlined"
                  size="small"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth size="small">
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
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required size="small">
                  <InputLabel>Impact</InputLabel>
                  <Select name="impact" value={formData.impact} onChange={handleChange} label="Impact">
                    <MenuItem value="1">1 - High</MenuItem>
                    <MenuItem value="2">2 - Medium</MenuItem>
                    <MenuItem value="3">3 - Low</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required size="small">
                  <InputLabel>Urgency</InputLabel>
                  <Select name="urgency" value={formData.urgency} onChange={handleChange} label="Urgency">
                    <MenuItem value="1">1 - High</MenuItem>
                    <MenuItem value="2">2 - Medium</MenuItem>
                    <MenuItem value="3">3 - Low</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: "flex", gap: 2, pt: 1 }}>
                  <Button type="submit" variant="contained" size="medium">
                    {editingId ? "Update Incident" : "Create Incident"}
                  </Button>
                  {editingId && (
                    <Button
                      variant="outlined"
                      size="medium"
                      onClick={() => {
                        setFormData({ description: "", state: "", impact: "", urgency: "" });
                        setEditingId(null);
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Incidents List Section */}
          <Box>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: "#1565c0" }}>
              📋 Incident Records
            </Typography>

            {incidents.length === 0 ? (
              <Typography sx={{ textAlign: "center", color: "#999", py: 4 }}>
                No incidents found. Create one to get started!
              </Typography>
            ) : (
              <Grid container spacing={2} className={styles.cardsGrid}>
                {incidents.map((inc) => (
                  <Grid item xs={12} sm={6} md={4} key={inc.sys_id}>
                    <Card className={styles.card}>
                      <CardContent className={styles.cardContent}>
                        <Typography variant="h6" className={styles.cardTitle}>
                          #{inc.number}
                        </Typography>
                        <Typography variant="body2" className={styles.cardDesc}>
                          {inc.short_description}
                        </Typography>
                        <Box sx={{ mt: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography variant="caption" sx={{ fontWeight: 500 }}>
                            Status:
                          </Typography>
                          <Chip label={inc.state} size="small" variant="outlined" />
                        </Box>
                      </CardContent>
                      <CardActions className={styles.cardActions}>
                        <Box sx={{ display: "flex", gap: 1, flex: 1, justifyContent: "space-between", width: "100%" }}>
                          <Box sx={{ display: "flex", gap: 0.5 }}>
                            <Chip label={`Impact: ${inc.impact ?? "-"}`} size="small" color="primary" variant="filled" />
                            <Chip label={`Urgency: ${inc.urgency ?? "-"}`} size="small" color="secondary" variant="filled" />
                          </Box>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                              size="small"
                              variant="outlined"
                              color="success"
                              onClick={() => onEdit(inc)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() => onDelete(inc.sys_id)}
                            >
                              Delete
                            </Button>
                          </Box>
                        </Box>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Stack>
      ) : (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Please log in to continue
          </Typography>
          <Typography variant="body2" sx={{ color: "#666" }}>
            Use the login button in the top-right corner to authenticate with ServiceNow.
          </Typography>
        </Box>
      )}
    </>
  );
}