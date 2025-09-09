import React, { useState } from "react";
import { useRouter } from "next/router";

import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";

export default function AuthPage() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerTel, setRegisterTel] = useState("");

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const router = useRouter();

  const handleSnackbarClose = () => setOpenSnackbar(false);

  const handleLoginSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: loginEmail,       // username OR email
        password_hash: loginPassword,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Login failed');
    }

    await response.json();

    setSnackbarMessage('Login successful!');
    setSnackbarSeverity('success');
    setOpenSnackbar(true);

    // 🚀 Redirect to dashboard page
    router.push('/dashboard');

  } catch (error) {
    setSnackbarMessage(error.message);
    setSnackbarSeverity('error');
    setOpenSnackbar(true);
  }
};


  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: registerUsername || `${firstName}${lastName}`.trim(),
            email: registerEmail,
            password_hash: registerPassword,
            first_name: firstName,
            last_name: lastName,
            tel: registerTel
        }),
        });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Registration failed");
      }

      await response.json();
      setSnackbarMessage("Registration successful!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (err) {
      setSnackbarMessage(err.message);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ pt: { xs: 4, md: 8 }, pb: 6 }}>
        {/* Hero */}
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                lineHeight: 1.1,
                mb: 2,
              }}
            >
              Welcome to your
              <br />
              Study Partner!
            </Typography>

            <Typography sx={{ color: "text.secondary", mb: 2 }}>
              Your AI-powered study companion
            </Typography>

            <Typography sx={{ color: "text.primary", maxWidth: 520 }}>
              Study Partner makes learning easier and smarter. Upload your PDF
              notes, textbooks, or articles, and let AI instantly generate clear
              summaries, personalized quizzes, and interactive flashcards.
              Whether you’re preparing for exams or just revising, Study
              Partner helps you save time, stay organized, and focus on what
              matters most—understanding and remembering your lessons.
            </Typography>
          </Grid>

          <Grid item xs={12} md={5}>
            <Box
              component="img"
              src="/assets/testing.jpg"
              alt="Portrait"
              sx={{
                width: "100%",
                height: { xs: 260, md: 420 },
                objectFit: "cover",
                borderRadius: 1,
                display: "block",
              }}
            />
          </Grid>
        </Grid>

        {/* Forms */}
        <Grid container spacing={4} sx={{ mt: { xs: 4, md: 6 } }}>
          {/* Sign up */}
          <Grid item xs={12} md={7}>
            <Paper elevation={0} sx={{ p: 0 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                Sign up
              </Typography>

              <Box component="form" onSubmit={handleRegisterSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Username"
                      value={registerUsername}
                      onChange={(e) => setRegisterUsername(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Create Password"
                      type="password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Email address"
                      type="email"
                      placeholder="email@janesfakedomain.net"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Tel:"
                      placeholder="Enter your mobile phone number"
                      value={registerTel}
                      onChange={(e) => setRegisterTel(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      fullWidth
                      sx={{
                        textTransform: "none",
                        bgcolor: "black",
                        ":hover": { bgcolor: "#111" },
                      }}
                      variant="contained"
                    >
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>

          {/* Sign in */}
          <Grid item xs={12} md={5}>
            <Paper elevation={0} sx={{ p: 0 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Divider sx={{ width: 36, mr: 1, borderWidth: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Sign in
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleLoginSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Username"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      fullWidth
                      sx={{
                        textTransform: "none",
                        bgcolor: "black",
                        ":hover": { bgcolor: "#111" },
                      }}
                      variant="contained"
                    >
                      Go to Home page!
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Footer */}
        <Box sx={{ mt: 8 }}>
          <Typography sx={{ color: "text.secondary" }}>Study Partner!</Typography>
        </Box>
      </Container>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
