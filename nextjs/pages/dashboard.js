import React, { useRef, useState, useEffect } from "react";
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
  const [recent, setRecent] = useState([]); // [{id,name,file_path,uploaded_at}]
  const [pdfName, setPdfName] = useState("");
  const [userId] = useState(1); // later: replace with logged-in user id

  // NEW: selection state for Recent PDF (single-select)
  const [selectedIds, setSelectedIds] = useState([]);
  const toggleSelect = (id) =>
    setSelectedIds((prev) => (prev[0] === id ? [] : [id]));

  const fetchRecent = async () => {
    try {
      const res = await fetch(`/api/files/recent/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setRecent(data);
      } else {
        console.error("Failed to load recent files");
      }
    } catch (e) {
      console.error("Error loading recent files:", e);
    }
  };

  useEffect(() => {
    fetchRecent();
  }, []);

  const onPick = () => inputRef.current?.click();

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("user_id", String(userId));
    formData.append("name", pdfName || file.name);
    formData.append("file", file);

    try {
      const res = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setPdfName("");
        await fetchRecent(); // refresh list from server
      } else {
        console.error("Upload failed");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
    } finally {
      // reset the file input so picking the same file again re-triggers onChange
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh" }}>
      {/* Hero */}
      <Box
        sx={{
          height: { xs: 220, md: 320 },
          backgroundImage: `url('/assets/hero-pears.jpg')`,
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
            {/* PDF name input */}
            <Box sx={{ mb: 2 }}>
              <input
                type="text"
                placeholder="Document name"
                value={pdfName}
                onChange={(e) => setPdfName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </Box>

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
                "&::-webkit-scrollbar-thumb": {
                  bgcolor: "#d1cfe1",
                  borderRadius: 8,
                },
              }}
            >
              <List dense disablePadding sx={{ py: 0 }}>
                {recent.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  return (
                    <ListItem
                      key={item.id}
                      button
                      onClick={() => toggleSelect(item.id)}
                      selected={isSelected}
                      sx={{
                        px: 1.5,
                        py: 1,
                        borderLeft: isSelected
                          ? "3px solid"
                          : "3px solid transparent",
                        borderColor: isSelected ? "primary.main" : "transparent",
                        bgcolor: isSelected ? "action.selected" : "inherit",
                      }}
                    >
                      <ListItemText
                        primaryTypographyProps={{
                          noWrap: true,
                          fontSize: 14,
                          fontWeight: isSelected ? 700 : 400,
                        }}
                        secondaryTypographyProps={{ fontSize: 12 }}
                        primary={
                          <a
                            href={`/${item.file_path}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ textDecoration: "none", color: "inherit" }}
                            onClick={(e) => e.stopPropagation()}
                            title={item.name}
                          >
                            {item.name}
                          </a>
                        }
                        secondary="PDF"
                      />
                    </ListItem>
                  );
                })}
                {recent.length === 0 && (
                  <ListItem sx={{ px: 1.5, py: 1 }}>
                    <ListItemText
                      primaryTypographyProps={{ fontSize: 14 }}
                      primary="No files yet"
                      secondary="Upload a PDF to get started"
                    />
                  </ListItem>
                )}
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
            <Box component="a" href="/tasks/summarize" sx={{ textDecoration: "none" }}>
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
                <Box component="img" src="/assets/task-1.jpg" alt="Summarize" sx={{ width: "100%", display: "block" }} />
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
                <Box component="img" src="/assets/task-2.jpg" alt="Quiz" sx={{ width: "100%", display: "block" }} />
                <Box sx={{ px: 2, py: 1.25 }}>
                  <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                    Make Quiz
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Grid>

          <Grid item xs={12} sm={8} md={6}>
            <Box component="a" href="/tasks/flashcards" sx={{ textDecoration: "none" }}>
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
                <Box component="img" src="/assets/task-3.jpg" alt="Flashcards" sx={{ width: "100%", display: "block" }} />
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
