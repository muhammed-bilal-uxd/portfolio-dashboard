import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL + "/projects";

export default function ProjectPage() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    name: "",
  });
  const [editId, setEditId] = useState(null);

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

  useEffect(() => {
    getProjects();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await fetch(`${API_URL}/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }

      setForm({ name: "" });
      setEditId(null);
      getProjects();
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const handleEdit = (project) => {
    setForm({
      name: project.name,
    });
    setEditId(project._id);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      getProjects();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Project List</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          type="text"
          name="name"
          placeholder="Project name"
          value={form.name}
          onChange={handleChange}
        />
        <button type="submit">{editId ? "Update" : "Add"} Project</button>
      </form>

      {projects.map((project) => (
        <div
          key={project._id}
          style={{
            border: "1px solid #ccc",
            padding: 12,
            marginBottom: 10,
            borderRadius: 8,
          }}
        >
          <h3
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/project/${project._id}`)}
          >
            {project.name}
          </h3>

          <button onClick={() => handleEdit(project)}>Edit</button>
          <button onClick={() => handleDelete(project._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
