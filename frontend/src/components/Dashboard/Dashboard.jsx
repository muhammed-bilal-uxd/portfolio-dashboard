// dependencies
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// components
import ChartModel from "../ChartModel/ChartModel";

// css
import "./Dashboard.css";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button } from "@mui/material";

// env
const VITE_API_URL = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  // variable start
  const [configList, setConfigList] = useState([]);
  const [projectDetail, setProjectDetail] = useState({});

  const { id: projectId } = useParams();
  const navigate = useNavigate();

  const onStartLoad = () => {
    getProjectDetail();
    // getAllSources();
    getAllCharts();

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  const getAllCharts = async () => {
    const url = VITE_API_URL + `/project-chart?projectId=${projectId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await response.json().catch(() => null);

    if (res && Array.isArray(res)) {
      console.log("res", res);
      setConfigList([...res]);
    }
  };

  const getProjectDetail = async () => {
    if (!projectId) return alert("project id needed");

    try {
      const url = VITE_API_URL + `/projects/${projectId}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const res = await response.json().catch(() => null);

      setProjectDetail(res);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleNavNextSection = (value) => {
    const id = "section-container-" + value;
    const elementId = document.getElementById(id);

    if (elementId) {
      elementId.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    onStartLoad();
  }, []);

  // dev start
  return (
    <div className="dashboard-root">
      {/* tittle */}
      <div className="dashboard-header">
        <ArrowBackIcon
          className="arrow-back"
          onClick={() => {
            navigate("/");
          }}
        />

        <h1 className="dashboard-title">
          Dashboard - {projectDetail?.name || "<project name>"}
        </h1>

        <div>
          <Button onClick={() => navigate(`/add-new-chart/${projectId}`)}>
            Add new Chart
          </Button>
        </div>
      </div>

      <section className="section-container" id="section-container-5">
        {/* <b className="step-name">step : 5</b> */}
        <div
          style={{
            display: "flex",
            // alignItems: "center",
            // justifyContent: "center",
            flexDirection: "column",
            gap: 50,
          }}
        >
          {configList.map((data, index) => (
            <ChartModel
              key={data?._id}
              configData={data}
              dataIndex={index}
            ></ChartModel>
          ))}
        </div>
      </section>
      <div className="next-button-container">
        <button onClick={() => handleNavNextSection(5)}>back to top</button>
      </div>
    </div>
  );
}
