import React, { useRef, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  ButtonBase,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

export default function DashboardPage() {
  const inputRef = useRef(null);
  const [recent, setRecent] = useState([
    "Week_3_Notes.pdf",
    "Signals_Lab1.pdf",
    "AI_Outline.pdf",
  ]);

  const onPick = () => inputRef.current?.click();
  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setRecent((r) => [f.name, ...r].slice(0, 10));
  };

  return (
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh" }}>
      {/* Hero */}
      <Box
        sx={{
          height: { xs: 220, md: 320 },
          backgroundImage: `url('/hero-pears.jpg'), linear-gradient(180deg,#ddd,#ccc)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Box sx={{ px: 2, textShadow: "0 2px 8px rgba(0,0,0,.35)" }}>
          <Typography variant="h3" sx={{ fontWeight: 800 }}>
            Your Study Partner!
          </Typography>
          <Typography sx={{ mt: 1, maxWidth: 680, mx: "auto" }}>
            Make every study session productive—summarize long documents, test
            your knowledge with quizzes, and reinforce learning with flashcards.
          </Typography>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Profile
        </Typography>

        <Grid container spacing={3} sx={{ mb: { xs: 4, md: 6 } }}>
          {/* Upload box */}
          <Grid item xs={12} md={7}>
            <Paper
              variant="outlined"
              sx={{
                borderStyle: "dashed",
                p: 2,
                height: 180,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 2,
              }}
            >
              <ButtonBase
                onClick={onPick}
                sx={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography sx={{ color: "text.secondary" }}>
                  Upload your PDF here!
                </Typography>
              </ButtonBase>
              <input
                ref={inputRef}
                type="file"
                accept="application/pdf"
                onChange={onFile}
                hidden
              />
            </Paper>
          </Grid>

          {/* Recent PDF */}
          <Grid item xs={12} md={5}>
            <Typography sx={{ fontSize: 14, color: "text.primary", mb: 1 }}>
              Recent PDF
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 0,
                height: 180,
                overflow: "auto",
                borderRadius: 2,
                "&::-webkit-scrollbar": { width: 6 },
                "&::-webkit-scrollbar-thumb": { bgcolor: "#d1cfe1", borderRadius: 8 },
              }}
            >
              <List dense disablePadding sx={{ py: 0 }}>
                {recent.map((name, i) => (
                  <ListItem key={name + i} sx={{ px: 1.5, py: 1 }}>
                    <ListItemText
                      primaryTypographyProps={{ noWrap: true, fontSize: 14 }}
                      secondaryTypographyProps={{ fontSize: 12 }}
                      primary={name}
                      secondary="PDF"
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>

        {/* Choose task */}
        <Typography
          variant="h6"
          sx={{ textAlign: "center", fontWeight: 700, mb: 3 }}
        >
          Choose task
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={5}>
            <Box
              component="a"
              href="/tasks/summarize"
              sx={{ textDecoration: "none" }}
            >
              <Paper
                elevation={0}
                sx={{
                  border: "1px solid #eee",
                  borderRadius: 3,
                  overflow: "hidden",
                  transition: "transform .15s ease",
                  ":hover": { transform: "translateY(-2px)" },
                }}
              >
                <Box
                  component="img"
                  src="/task-1.jpg"
                  alt="Summarize"
                  sx={{ width: "100%", display: "block" }}
                />
                <Box sx={{ px: 2, py: 1.25 }}>
                  <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                    Summarize your materials
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={5}>
            <Box component="a" href="/tasks/quiz" sx={{ textDecoration: "none" }}>
              <Paper
                elevation={0}
                sx={{
                  border: "1px solid #eee",
                  borderRadius: 3,
                  overflow: "hidden",
                  transition: "transform .15s ease",
                  ":hover": { transform: "translateY(-2px)" },
                }}
              >
                <Box
                  component="img"
                  src="/task-2.jpg"
                  alt="Quiz"
                  sx={{ width: "100%", display: "block" }}
                />
                <Box sx={{ px: 2, py: 1.25 }}>
                  <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                    Make Quiz
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Grid>

          <Grid item xs={12} sm={8} md={6}>
            <Box
              component="a"
              href="/tasks/flashcards"
              sx={{ textDecoration: "none" }}
            >
              <Paper
                elevation={0}
                sx={{
                  border: "1px solid #eee",
                  borderRadius: 3,
                  overflow: "hidden",
                  transition: "transform .15s ease",
                  ":hover": { transform: "translateY(-2px)" },
                }}
              >
                <Box
                  component="img"
                  src="/task-3.jpg"
                  alt="Flashcards"
                  sx={{ width: "100%", display: "block" }}
                />
                <Box sx={{ px: 2, py: 1.25 }}>
                  <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                    Make flashcard
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
