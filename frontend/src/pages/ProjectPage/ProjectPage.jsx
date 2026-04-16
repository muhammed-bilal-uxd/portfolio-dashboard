import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./ProjectPage.css";

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
      // alert(err.message);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
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

      console.log("res", res);

      if (![200, 201].includes(res.status)) {
        throw new Error(
          res?.message || `Request failed with status ${res.status}`,
        );
      }

      setForm({ name: "" });
      setEditId(null);
      getProjects();
    } catch (err) {
      console.error("Submit error:", err);
      alert(err.message);
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

  useEffect(() => {
    getProjects();

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="project-container">
      <h1>Project List</h1>

      <form onSubmit={handleSubmit} className="project-form">
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
        <div key={project._id} className="project-card">
          <h3
            className={"cursor-pointer project-name"}
            onClick={() => navigate(`/dashboard/${project._id}`)}
          >
            {project.name}
          </h3>

          <button onClick={() => handleEdit(project)}>Rename</button>
          <button onClick={() => handleDelete(project._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
