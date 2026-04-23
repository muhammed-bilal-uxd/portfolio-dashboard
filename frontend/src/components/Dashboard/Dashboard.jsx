// dependencies
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// components
import ChartModel from "../ChartModel/ChartModel";

// css
import "./Dashboard.css";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SearchIcon from "@mui/icons-material/Search";
import AutoAwesomeMosaicIcon from "@mui/icons-material/AutoAwesomeMosaic";
import AddIcon from "@mui/icons-material/Add";
import { Button, IconButton, Box, Typography } from "@mui/material";

// env
const VITE_API_URL = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  // variable start
  const [configList, setConfigList] = useState([]);
  const [projectDetail, setProjectDetail] = useState({});
  const [search, setSearch] = useState("");

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
    <div className="dashboard-page-root">
      {/* title */}
      <div className="dashboard-page-header">
        <IconButton
          aria-label="Go back to projects"
          onClick={() => navigate("/")}
          size="large"
          sx={{
            color: "var(--color-on-surface-variant)",
            borderRadius: "10px",
            flexShrink: 0,
            "&:hover": {
              color: "var(--color-primary)",
              backgroundColor: "var(--color-surface-container-highest)",
            },
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 28 }} />
        </IconButton>

        <h1 className="dashboard-page-title">
          Dashboard - {projectDetail?.name || "<project name>"}
        </h1>

        <div className="dashboard-header-action" style={{ display: 'none' }}>
           {/* Desktop view could have search too, but keeping it hidden for now as per mobile request focus */}
        </div>
        
        {/* Desktop Add Button - Hidden on xs and when empty */}
        {configList.length > 0 && (
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Button
              color="primary"
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate(`/add-new-chart/${projectId}`)}
              sx={{ 
                fontWeight: 700, 
                whiteSpace: "nowrap",
                borderRadius: "24px",
                textTransform: "none",
                px: 3,
                bgcolor: "var(--color-tertiary)",
                "&:hover": { bgcolor: "var(--color-tertiary)", opacity: 0.9 }
              }}
            >
              Add New Chart
            </Button>
          </Box>
        )}
      </div>

      {/* ── Mobile Actions row: Only visible on xs and when not empty ── */}
      {configList.length > 0 && (
        <Box className="mobile-actions-row" sx={{ display: { xs: "flex", sm: "none" }, gap: 1.5, mb: 3 }}>
          <div className="search-prominent-wrap" style={{ flex: '0 0 70%', padding: '10px 16px' }}>
            <SearchIcon className="search-icon-fixed" />
            <input
              className="search-prominent-input"
              placeholder="Search Charts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search charts"
            />
          </div>
          <IconButton
            onClick={() => navigate(`/add-new-chart/${projectId}`)}
            sx={{
              flex: '0 0 calc(30% - 12px)',
              height: 44,
              borderRadius: "12px",
              bgcolor: "var(--color-tertiary)",
              color: "#ffffff",
              boxShadow: "0 8px 16px rgba(103, 156, 255, 0.2)",
              "&:hover": {
                bgcolor: "var(--color-tertiary)",
                opacity: 0.9
              }
            }}
          >
            <AddIcon sx={{ fontSize: 24 }} />
          </IconButton>
        </Box>
      )}

      <section className="section-chart-container" id="section-container-5">
        {/* <b className="step-name">step : 5</b> */}
        <div className="dashboard-chart-list">
          {configList.length > 0 ? (
            configList
              .filter(data => {
                const name = data?.configName || "";
                return name.toLowerCase().includes(search.toLowerCase());
              })
              .map((data, index) => (
              <ChartModel
                key={data?._id}
                configData={data}
                dataIndex={index}
              ></ChartModel>
            ))
          ) : (
            <Box className="dashboard-empty-state" sx={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              justifyContent: "center",
              py: 8,
              px: 2,
              textAlign: "center"
            }}>
              <Box className="empty-state-icon-box" sx={{
                width: 64,
                height: 64,
                bgcolor: "var(--color-surface-container-highest)",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 3,
                border: "1px solid var(--color-outline-variant)"
              }}>
                <AutoAwesomeMosaicIcon sx={{ fontSize: 32, color: "var(--color-tertiary)" }} />
              </Box>
              <Typography sx={{ 
                fontFamily: "var(--font-headline)", 
                fontWeight: 800, 
                fontSize: "1.5rem", 
                color: "var(--color-on-surface)",
                mb: 4
              }}>
                No charts to display
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate(`/add-new-chart/${projectId}`)}
                sx={{
                  bgcolor: "var(--color-tertiary)",
                  color: "#ffffff",
                  fontWeight: 700,
                  textTransform: "none",
                  borderRadius: "24px",
                  px: 5,
                  py: 1.25,
                  fontSize: "1rem",
                  boxShadow: "0 8px 32px rgba(103, 156, 255, 0.3)",
                  "&:hover": {
                    bgcolor: "var(--color-tertiary)",
                    opacity: 0.9,
                    boxShadow: "0 12px 40px rgba(103, 156, 255, 0.4)",
                  }
                }}
              >
                Create Chart
              </Button>
            </Box>
          )}
        </div>
      </section>
      {configList.length > 0 && (
        <div className="dashboard-page-next-button-container">
          <Button
            variant="text"
            startIcon={<KeyboardArrowUpIcon />}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            sx={{
              color: "var(--color-on-surface-variant)",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "transparent",
                color: "var(--color-primary)"
              }
            }}
          >
            Back to Top
          </Button>
        </div>
      )}
    </div>
  );
}
