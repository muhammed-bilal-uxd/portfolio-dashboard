import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  InputAdornment,
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
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import CloseIcon from "@mui/icons-material/Close";

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

<<<<<<< HEAD
      {/* ── Page header ── */}
      <div className="project-page-header">
        <h1 className="project-heading">Projects</h1>
        
        <div className="header-actions">
          <TextField
            size="small"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-compact"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
            inputProps={{ "aria-label": "Search projects" }}
          />
          <Button
            color="primary"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNewProject}
            sx={{ fontWeight: 700, whiteSpace: "nowrap" }}
=======
      <form onSubmit={handleSubmit} className="project-form">
      <Stack direction="row" spacing={1}>
        <input
          type="text"
          name="name"
          placeholder="Project name"
          value={form.name}
          onChange={handleChange}
        />
          <Button color="primary" variant="contained" type="submit">
            {editId ? "Update" : "Add"} Project
          </Button>
        </Stack>
      </form>

      {projects.map((project) => (
        <div key={project._id} className="project-card">
          <h3
            className="cursor-pointer project-name"
            onClick={() => navigate(`/dashboard/${project._id}`)}
>>>>>>> d220485a2c569dac90904c0557172cd744c6ee6b
          >
            New Project
          </Button>
        </div>
      </div>

      {/* ── Add / Edit Modal ── */}
      <Dialog
        open={showForm}
        onClose={handleCancelEdit}
        aria-labelledby="modal-title"
        maxWidth="xs"
        fullWidth
        PaperProps={{
          style: {
            padding: "8px", // Gives some breathing room to the contents inside the radius
          }
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingRight: "16px" }}>
          <DialogTitle id="modal-title" sx={{ fontFamily: "var(--font-headline)", fontWeight: 700, pb: 1, letterSpacing: "-0.01em" }}>
            {editId ? "Rename Project" : "New Project"}
          </DialogTitle>
          <IconButton aria-label="Close dialog" onClick={handleCancelEdit} size="small">
            <CloseIcon fontSize="small" aria-hidden="true" />
          </IconButton>
        </div>
        
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: "8px !important" }}>
            <label htmlFor="project-name-input" className="visually-hidden">
              Project Name
            </label>
            <TextField
              id="project-name-input"
              fullWidth
              name="name"
              placeholder={editId ? "Enter new name…" : "e.g. Sales Dashboard"}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              inputProps={{ "aria-label": "Project name" }}
              autoFocus
              autoComplete="off"
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              color="inherit"
              onClick={handleCancelEdit}
              sx={{ color: "var(--color-on-surface-variant)" }}
            >
              Cancel
            </Button>
            <Button color="primary" variant="contained" type="submit" disabled={!form.name.trim()}>
              {editId ? "Update" : "Add Project"}
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

              {/* Leading folder icon */}
              <FolderOpenOutlinedIcon className="project-row-icon" />

              {/* Name — full width, prominent */}
              <button
                className="project-row-name"
                onClick={() => navigate(`/dashboard/${project._id}`)}
                aria-label={`Open project ${project.name}`}
              >
                {project.name}
              </button>

              {/* ⋮ trailing menu — always visible */}
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
