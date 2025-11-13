import { Container, Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          textAlign: "center",
          py: 4,
        }}
      >
        <Typography variant="h2" sx={{ fontWeight: 700, mb: 2, color: "#1565c0" }}>
          404
        </Typography>

        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          Page Not Found
        </Typography>

        <Typography variant="body1" sx={{ color: "#666", mb: 4, maxWidth: "400px" }}>
          The page you're looking for doesn't exist.
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="contained" onClick={() => navigate("/")}>
            Home
          </Button>
          <Button variant="outlined" onClick={() => navigate("/about")}>
            About
          </Button>
        </Box>
      </Box>
    </Container>
  );
}