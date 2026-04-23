import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Box,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeMosaicIcon from "@mui/icons-material/AutoAwesomeMosaic";

import "./ProjectPage.css";

const API_URL = import.meta.env.VITE_API_URL + "/projects";

function ProjectRowMenu({ project, onRename, onDelete }) {
  const [anchor, setAnchor] = useState(null);
  const open = Boolean(anchor);

  const handleOpen = (e) => {
    e.stopPropagation();
    setAnchor(e.currentTarget);
  };
  const handleClose = () => setAnchor(null);

  return (
    <>
      <IconButton
        aria-label={`Actions for ${project.name}`}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        size="small"
        onClick={handleOpen}
        className="row-more-btn"
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>

      <Menu
        anchorEl={anchor}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            elevation: 8,
            sx: {
              minWidth: 172,
              borderRadius: "12px",
              border: "1px solid",
              borderColor: "divider",
              backgroundImage: "none",
              bgcolor: "background.paper",
              "& .MuiMenuItem-root": {
                fontSize: "0.875rem",
                fontWeight: 500,
                py: 1.25,
                px: 2,
                borderRadius: "8px",
                mx: 0.5,
                my: 0.25,
              },
            },
          },
        }}
      >
        <MenuItem onClick={() => { handleClose(); onRename(project); }}>
          <ListItemIcon>
            <DriveFileRenameOutlineIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Rename" />
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        <MenuItem
          onClick={() => { handleClose(); onDelete(project._id); }}
          sx={{
            color: "error.main",
            "&:hover": { bgcolor: "rgba(239,68,68,0.08)" },
            "& .MuiListItemIcon-root": { color: "error.main" },
          }}
        >
          <ListItemIcon>
            <DeleteOutlineIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Delete" />
        </MenuItem>
      </Menu>
    </>
  );
}

export default function ProjectPage() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: "" });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  const getProjects = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editId) {
        response = await fetch(`${API_URL}/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      const res = await response.json().catch(() => null);
      if (![200, 201].includes(res.status)) {
        throw new Error(res?.message || `Request failed with status ${res.status}`);
      }
      setForm({ name: "" });
      setEditId(null);
      setShowForm(false);
      getProjects();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (project) => {
    setForm({ name: project.name });
    setEditId(project._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      getProjects();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleNewProject = () => {
    setEditId(null);
    setForm({ name: "" });
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setForm({ name: "" });
    setShowForm(false);
  };

  useEffect(() => {
    getProjects();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="project-container">
      {/* ── Page header ── */}
      <div className="project-page-header">
        <h1 className="project-heading">Projects</h1>

        {/* Desktop actions: Only visible on sm+ */}
        <Box className="header-actions" sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 2 }}>
          <div className="search-prominent-wrap" style={{ padding: '6px 12px', margin: 0 }}>
             <SearchIcon sx={{ fontSize: 18, color: 'var(--color-on-surface-variant)' }} />
             <input
                className="search-prominent-input"
                style={{ fontSize: '0.875rem', width: '180px' }}
                placeholder="Search…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
          </div>
          <Button
            color="primary"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNewProject}
            sx={{
              fontWeight: 600,
              borderRadius: "10px",
              textTransform: "none",
              px: 2,
              boxShadow: "none"
            }}
          >
            New Project
          </Button>
        </Box>
      </div>

      {/* ── Mobile Actions row: Only visible on xs ── */}
      <Box className="mobile-actions-row" sx={{ display: { xs: "flex", sm: "none" }, gap: 1.5, mb: 3 }}>
        <div className="search-prominent-wrap" style={{ flex: 1, padding: '10px 16px' }}>
          <SearchIcon className="search-icon-fixed" />
          <input
            className="search-prominent-input"
            placeholder="Search Projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search projects"
          />
        </div>
        <IconButton
          onClick={handleNewProject}
          sx={{
            width: 52,
            height: 44,
            borderRadius: "12px",
            bgcolor: "#ffffff",
            color: "#000000",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            "&:hover": {
              bgcolor: "#f0f0f0",
            }
          }}
        >
          <AddIcon sx={{ fontSize: 28 }} />
        </IconButton>
      </Box>

      {/* ── Add / Edit Modal ── */}
      <Dialog
        open={showForm}
        onClose={handleCancelEdit}
        aria-labelledby="modal-title"
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "24px",
            bgcolor: "var(--color-surface-container-high)",
            backgroundImage: "none",
            border: "1px solid var(--color-outline-variant)",
            p: { xs: 0, sm: 1 },
            boxShadow: "0 24px 48px rgba(0,0,0,0.4)",
          }
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingRight: "8px" }}>
          <DialogTitle id="modal-title" sx={{ 
            fontFamily: "var(--font-headline)", 
            fontWeight: 800, 
            fontSize: { xs: "1.25rem", sm: "1.5rem" }, 
            color: "var(--color-on-surface)", 
            pb: { xs: 0.5, sm: 1 },
            px: { xs: 2, sm: 3 },
            pt: { xs: 2, sm: 3 }
          }}>
            {editId ? "Rename Project" : "New Project"}
          </DialogTitle>
          <IconButton aria-label="Close" onClick={handleCancelEdit} sx={{ color: "var(--color-on-surface-variant)", mt: { xs: 1, sm: 0 } }}>
            <CloseIcon />
          </IconButton>
        </div>

        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ px: { xs: 2, sm: 3 }, pt: { xs: 0.5, sm: 1 }, pb: { xs: 1, sm: 2 } }}>
            <Typography sx={{ color: "var(--color-on-surface-variant)", fontSize: "0.875rem", mb: 1.5, fontWeight: 500 }}>
              Give your project a name to get started.
            </Typography>
            <TextField
              id="project-name-input"
              fullWidth
              autoFocus
              placeholder="e.g. Marketing Dashboard"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "var(--color-surface-container)",
                  borderRadius: "14px",
                  "& fieldset": { borderColor: "var(--color-outline-variant)" },
                  "&:hover fieldset": { borderColor: "var(--color-outline)" },
                  "&.Mui-focused fieldset": { borderColor: "var(--color-primary)" },
                },
                "& .MuiInputBase-input": {
                  color: "var(--color-on-surface)",
                  fontFamily: "var(--font-body)",
                  fontWeight: 500,
                }
              }}
            />
          </DialogContent>
          <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 }, pt: 0 }}>
            <Button
              variant="contained"
              type="submit"
              disabled={!form.name.trim()}
              fullWidth
              sx={{
                bgcolor: "var(--color-tertiary)",
                color: "#ffffff",
                fontWeight: 700,
                textTransform: "none",
                borderRadius: "12px",
                py: { xs: 1.25, sm: 1.5 },
                fontSize: "1rem",
                boxShadow: "0 4px 12px rgba(103, 156, 255, 0.3)",
                whiteSpace: "nowrap",
                "&:hover": {
                  bgcolor: "var(--color-tertiary)",
                  opacity: 0.9,
                },
                "&.Mui-disabled": {
                  bgcolor: "var(--color-surface-container-highest)",
                  color: "var(--color-on-surface-variant)",
                  opacity: 0.5
                }
              }}
            >
              Add Project
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ── Project list ── */}
      {filteredProjects.length === 0 ? (
        <p className="project-empty">
          {search
            ? `No projects matching "${search}"`
            : "No projects yet — create your first one!"}
        </p>
      ) : (
        <div className="project-list" role="list" aria-label="Projects">
          {filteredProjects.map((project) => (
            <div key={project._id} className="project-row" role="listitem">
              <div className="project-row-icon-container">
                <AutoAwesomeMosaicIcon className="project-modern-svg" sx={{ fontSize: 'inherit', color: 'var(--color-primary)' }} />
              </div>
              <button
                className="project-row-name"
                onClick={() => navigate(`/dashboard/${project._id}`)}
                aria-label={`Open project ${project.name}`}
              >
                {project.name}
              </button>
              <ProjectRowMenu
                project={project}
                onRename={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
