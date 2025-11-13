import { Container, Typography } from "@mui/material";

export default function About() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        About IncidentTracker
      </Typography>

      <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
        IncidentTracker is a <strong>simple and effective incident management application</strong> that helps you manage incidents directly from ServiceNow. 
        Whether you're tracking IT issues, service requests, or operational problems, IncidentTracker provides an <strong>easy-to-use interface</strong> to create, view, edit, and delete incidents.
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 2 }}>
        What You Can Do
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
        • <strong>Create incidents</strong> with a description, state, impact, and urgency<br />
        • <strong>View all incidents</strong> in an organized list<br />
        • <strong>Edit incidents</strong> to update their details<br />
        • <strong>Delete incidents</strong> that are no longer needed<br />
        • <strong>Switch between light and dark modes</strong> for comfortable viewing
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 2 }}>
        How It Works
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
        IncidentTracker connects to your <strong>ServiceNow instance</strong> using <strong>secure OAuth 2.0 authentication</strong>. 
        When you log in, your session is protected and all your changes are saved directly to ServiceNow. 
        The app is <strong>simple by design</strong> — no complicated workflows, just straightforward incident management.
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 2 }}>
        Getting Started
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
        1. Click the <strong>"Login"</strong> button at the top to authenticate with ServiceNow<br />
        2. Fill out the incident form with your details<br />
        3. Click <strong>"Create Incident"</strong> to save it<br />
        4. Use the <strong>"Edit"</strong> button to make changes or <strong>"Delete"</strong> to remove incidents<br />
        5. Use the dark mode toggle to switch themes anytime
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: 600, mt: 4, mb: 2 }}>
        Technology
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
        IncidentTracker is built with <strong>React</strong> on the frontend and <strong>Node.js with Express</strong> on the backend. 
        It uses <strong>Material-UI</strong> for the interface and integrates with <strong>ServiceNow REST API</strong>. 
        All communication is <strong>secure and encrypted</strong>.
      </Typography>

      <Typography variant="body2" sx={{ color: "#999", mt: 6, pt: 3, borderTop: "1px solid #ddd" }}>
        IncidentTracker © 2025 • Powered by ServiceNow
      </Typography>
    </Container>
  );
}