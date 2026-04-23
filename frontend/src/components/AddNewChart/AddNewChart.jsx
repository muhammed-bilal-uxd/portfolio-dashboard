// dependencies
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// components
import ChartModel from "../ChartModel/ChartModel";

// css
import "./AddNewChart.css";
import Modal from "../Modal/Modal";
import MappingData from "../MappingData/MappingData";
import CustomDropdown from "../CustomDropdown/CustomDropdown";
import { useLoading } from "../../context/LoadingContext";

import { checkTypeOfData } from "../../utils/common";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Stack } from "@mui/material";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  TextField,
  Box,
} from "@mui/material";

// env
const VITE_API_URL = import.meta.env.VITE_API_URL;

async function fetchJsonSource(urlToFetch) {
  const url = String(urlToFetch || "").trim();
  if (!url) {
    return {
      success: false,
      message: "Enter a URL or select a source.",
      data: null,
    };
  }

  try {
    new URL(url);
  } catch (err) {
    console.log("err", err);
    return { success: false, message: "Invalid URL", data: null };
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const res = await response.json();

    if (!res) {
      return { success: false, message: "No data from API", data: null };
    } else if (typeof res === "object" && res !== null && !Array.isArray(res)) {
      return { success: false, message: "data must be array", data: [] };
    } else if (Array.isArray(res) && !res.length) {
      return { success: false, message: "No data from API", data: [] };
    } else if (Array.isArray(res) && res.length) {
      return { success: true, message: "Success", data: res };
    } else {
      return { success: false, message: "error found", data: [] };
    }
  } catch (error) {
    return { success: false, message: error.message, data: null };
  }
}

const chartList = [
  { label: "Card", type: "card", active: true },
  { label: "Line Chart", type: "line", active: true },
  { label: "Bar Chart", type: "bar", active: true },
  { label: "Pie Chart", type: "pie", active: true },
  { label: "Doughnut Chart", type: "doughnut", active: true },
  { label: "Radar Chart", type: "radar", active: true },
  { label: "Polar Area Chart", type: "polar", active: true },
  { label: "Bubble Chart", type: "bubble", active: false },
  { label: "Scatter Chart", type: "scatter", active: false },
];

export default function AddNewChart() {
  // variable start
  const [selectListItemOne, setSelectListItemOne] = useState("");
  const [selectListItemTwo, setSelectListItemTwo] = useState("");
  const [tableItems, setTableItems] = useState([]);
  const [baseDataKeys, setBaseDataKeys] = useState([]);
  const [singleData, setSingleData] = useState(null);
  const [apiAllData, setApiAllData] = useState([]);
  const [selectedChart, setSelectedChart] = useState("");

  const [inputSource, setInputSource] = useState("");
  const [showSourcePopup, setShowSourcePopup] = useState(false);
  const [showDeleteSourcePopup, setShowDeleteSourcePopup] = useState(false);
  const [sourceLinkPopupConfig, setSourceLinkPopupConfig] = useState({
    sourceLink: "",
    isView: true,
  });
  const [sourcePreview, setSourcePreview] = useState(null);
  const [sourceList, setSourceList] = useState([]);
  const [selectedInputSource, setSelectedInputSource] = useState({});
  const [newConfigName, setNewConfigName] = useState("");
  const [configList, setConfigList] = useState([]);
  const [projectDetail, setProjectDetail] = useState({});
  const [expanded, setExpanded] = useState(1);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const { isLoading } = useLoading();
  const navigate = useNavigate();

  const { id: projectId } = useParams();

  const onStartLoad = () => {
    getProjectDetail();
    getAllSources();
    // getAllCharts();

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (!singleData || !baseDataKeys.length) return;

    const filterLabels = baseDataKeys.filter((name) =>
      checkTypeOfData(singleData[name], "string"),
    );

    const filterValues = baseDataKeys.filter((name) =>
      checkTypeOfData(singleData[name], "number"),
    );

    if (filterLabels[0]) {
      setSelectListItemOne(filterLabels[0]);
      setTableItems([0]);
      // setViewDataLabel(singleData[filterLabels[0]]);
      setSelectListItemTwo(filterValues[0]);
    }
  }, [singleData, baseDataKeys]);

  const handleSubmitUrl = () => {
    const url = selectedInputSource?.sourceLink;
    try {
      new URL(url);
      // valid URL, you can use it here
      getLinkWithBase(url);
      console.log("url", url);
    } catch (e) {
      alert("Please enter a valid URL.");
      return;
    }
  };

  const getLinkWithBase = async (url) => {
    try {
      const data = await fetch(url);

      if (!data.ok) {
        throw new Error(`Request failed with status ${data.status}`);
      }

      const res = await data.json();

      if (!res || res.length === 0) return alert("no data from api");

      const firstItem = res[0];
      setSingleData(firstItem);
      setApiAllData(res);

      const keys = Object.keys(firstItem);
      setBaseDataKeys(keys);
    } catch (err) {
      console.log(err);
    }
  };

  const isValidGenerateChart = () => {
    if (tableItems.length === 0) {
      alert("mapping section missing");
      return false;
    }

    if (newConfigName === "") {
      alert(selectedChart + " name missing");
      return false;
    }

    return true;
  };

  const handleAddNewChart = () => {
    if (!isValidGenerateChart()) return;

    const chartData =
      Array.isArray(tableItems) &&
      tableItems.map((i) => {
        return {
          label: apiAllData[i][selectListItemOne],
          value: apiAllData[i][selectListItemTwo],
        };
      });

    const newConfig = {
      baseDataKeys: baseDataKeys,
      singleData: singleData,
      projectId: projectId,
      sourceUrl: selectedInputSource?.sourceLink,
      chartType: selectedChart,
      selectListItemOne: selectListItemOne,
      selectListItemTwo: selectListItemTwo,
      apiAllData,
      configName: newConfigName.trim(),
      chartData: chartData,
      tableItems: tableItems,
    };

    console.log("newConfig", newConfig);

    addChart(newConfig);
  };

  const addChart = async (config) => {
    try {
      const url = VITE_API_URL + "/project-chart";
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: config, configName: config?.configName }),
      });

      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          payload?.message || `Request failed with status ${res.status}`,
        );
      }

      navigate(`/dashboard/${projectId}`);
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    if (!showSourcePopup) {
      setSourcePreview(null);
      return;
    }

    const url = sourceLinkPopupConfig?.sourceLink.trim();
    let cancelled = false;

    setSourcePreview({ loading: true, error: null, data: null });

    fetchJsonSource(url).then((result) => {
      if (cancelled) return;
      if (result.success) {
        setSourcePreview({ loading: false, error: null, data: result.data });
      } else {
        setSourcePreview({ loading: false, error: result.message, data: null });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [showSourcePopup, selectedInputSource, sourceLinkPopupConfig]);

  const handleSaveSource = async () => {
    console.log("projectId", projectId);
    if (!projectId) return alert("projectId not found");
    if (!sourceLinkPopupConfig?.sourceLink)
      return alert("source link not found");

    try {
      new URL(sourceLinkPopupConfig?.sourceLink);
    } catch (err) {
      console.log("err", err);
      return alert("Invalid URL");
    }

    try {
      const url = VITE_API_URL + "/project-source";
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: projectId,
          sourceLink: sourceLinkPopupConfig?.sourceLink,
        }),
      });

      const payload = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          payload?.message || `Request failed with status ${res.status}`,
        );
      }

      getAllSources();
      setShowSourcePopup(false);
    } catch (err) {
      alert(err.message);
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

  const getAllSources = async () => {
    if (!projectId) return alert("project id needed");

    const url = VITE_API_URL + `/project-source?projectId=${projectId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await response.json().catch(() => null);

    setSourceList([...res]);
    setSelectedInputSource(res[0]);
  };

  const getSourceShortLink = (link) => {
    return link.split("?")[0];
  };

  const getSourceEndPoint = (link = "") => {
    const urlArray = link.split("?")[0].split("/");
    return urlArray[urlArray.length - 1];
  };

  const removeSource = async (source) => {
    if (!source._id) alert("source not found");

    const url = VITE_API_URL + "/project-source/" + source._id;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await response.json().catch(() => null);

    alert(res.message);
    getAllSources();
  };

  const handleNavSection = (value) => {
    const id = "section-container-" + value;
    const elementId = document.getElementById(id);

    if (elementId) {
      setExpanded(value);
      elementId.scrollIntoView({ behavior: "smooth" });
    }
  };

  const onClickViewSource = (url) => {
    setSourceLinkPopupConfig({
      sourceLink: url,
      isView: true,
    });
    setShowSourcePopup(true);
  };

  const handleAddSource = () => {
    // To do: find duplicate at the beginning and return alert

    const sourceDuplicate =
      sourceList.map((s) => {
        return s?.sourceLink;
      }) || [];

    if (sourceDuplicate.includes(inputSource)) {
      return alert("Source already exists");
    }

    setSourceLinkPopupConfig({
      isView: false,
      sourceLink: inputSource,
    });
    setShowSourcePopup(true);
  };

  const handleChartOption = (value) => {
    setSelectedChart(value);
    setBaseDataKeys([]);
  };

  const handleMapData = () => {
    if (selectedChart === "") return alert("please select chart type");

    console.log("set 3");
    handleNavSection(3);
    handleSubmitUrl();
  };

  const handleChange = (panel) => (event, isExpanded) => {
    console.log("event", event);

    setExpanded(isExpanded ? panel : false);
  };

  const goToBackwardFromStep = (fromStep, isInitial) => {
    if (fromStep === 5) return;

    switch (fromStep) {
      case 1:
        // no need
        break;

      case 2:
        setSelectedChart("");
        break;

      case 3:
        setSelectListItemOne("");
        setSelectListItemTwo("");
        setTableItems([]);
        break;

      case 4:
        setNewConfigName("");
        break;

      default:
        return;
    }

    if (isInitial) {
      handleNavSection(fromStep - 1);
    }

    goToBackwardFromStep(fromStep + 1, false);
  };

  useEffect(() => {
    onStartLoad();
  }, []);

  // dev start
  return (
    <div className="add-chart-root">
      {/* tittle */}
      <div className="add-chart-header">
        <IconButton
          onClick={() => navigate(`/dashboard/${projectId}`)}
          sx={{
            color: "var(--color-on-surface)",
            mr: 1,
            "&:hover": { bgcolor: "rgba(255, 255, 255, 0.05)" }
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 28 }} />
        </IconButton>
        <h1 className="add-chart-title">
          Add New Chart - {projectDetail?.name || "<project name>"}
        </h1>
      </div>
      <Stack spacing={3}>
        <Accordion expanded={expanded === 1} disabled={false}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon className="expand-icon" />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <CustomTitle count={1}>Data Source Configuration</CustomTitle>
          </AccordionSummary>
          <AccordionDetails>
            <section className="section-container" id="section-container-1">
              {/* <b className="step-name">step : 1</b> */}

              {/* <h3>Paste rest data Url:</h3> */}
              <Box className="source-input-row" sx={{
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "stretch",
                gap: 1.5
              }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  className="input-source-url"
                  placeholder="Paste REST API URL here..."
                  value={inputSource}
                  onChange={(e) => setInputSource(e.target.value)}
                  inputProps={{ "aria-label": "REST API URL Source" }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      bgcolor: "var(--color-surface-container-low)"
                    }
                  }}
                />
                <Button
                  variant="contained"
                  disabled={!inputSource.trim()}
                  onClick={() => handleAddSource()}
                  className="btn-pill-primary"
                  sx={{
                    bgcolor: "var(--color-tertiary)",
                    height: { xs: "48px", sm: "40px" },
                    px: 4,
                    flexShrink: 0,
                    "&:hover": { bgcolor: "var(--color-tertiary)", opacity: 0.9 }
                  }}
                >
                  Add Source
                </Button>
              </Box>

              {showSourcePopup && (
                <Modal
                  title={" "}
                  isOpen={showSourcePopup}
                  onClose={() => setShowSourcePopup(false)}
                >
                  {sourcePreview?.loading && <p>Loading…</p>}
                  {sourcePreview?.error && (
                    <p className="source-preview-error">
                      {sourcePreview.error}
                    </p>
                  )}
                  {sourcePreview?.data != null && (
                    <>
                      <Box sx={{ mb: 2 }}>
                        <div className={"pop-title"}>Source Link </div>
                        <Typography variant="body2" sx={{
                          wordBreak: "break-all",
                          color: "var(--color-on-surface-variant)",
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.75rem",
                          bgcolor: "var(--color-surface-container-lowest)",
                          p: 1.5,
                          borderRadius: "8px",
                          border: "1px solid var(--color-outline-variant)"
                        }}>
                          {sourceLinkPopupConfig?.sourceLink}
                        </Typography>
                      </Box>

                      <div>
                        <div className={"pop-title"}> Preview Source Data </div>
                      </div>
                      <pre className="source-preview-json">
                        {JSON.stringify(sourcePreview.data, null, 4)}
                      </pre>
                      {!sourceLinkPopupConfig?.isView && (
                        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                          <Button
                            variant="contained"
                            onClick={() => handleSaveSource()}
                            className="btn-pill-primary"
                            sx={{
                              bgcolor: "var(--color-tertiary)",
                              "&:hover": { bgcolor: "var(--color-tertiary)", opacity: 0.9 }
                            }}
                          >
                            Save Link as Source
                          </Button>
                        </Box>
                      )}
                    </>
                  )}
                </Modal>
              )}

              {showDeleteSourcePopup && (
                <Modal
                  title={" "}
                  modalClassName="modal-compact"
                  isOpen={showDeleteSourcePopup}
                  onClose={() => {
                    setShowDeleteSourcePopup(false);
                  }}
                >
                  <h3>Are you sure, want to delete this source</h3>

                  <h5 className="source-link-preview">
                    {selectedInputSource?.sourceLink}
                  </h5>
                  <Stack direction="row" spacing={1} className="source-delete-actions">
                    <Button
                      color="inherit"
                      onClick={() => setShowDeleteSourcePopup(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      color="error"
                      variant="contained"
                      onClick={() => {
                        removeSource(selectedInputSource);
                        setShowDeleteSourcePopup(false);
                      }}
                    >
                      Confirm Yes
                    </Button>
                  </Stack>
                </Modal>
              )}

              <h3 className="section-subtitle">Select Source</h3>
              <div className="source-list">
                {Array.isArray(sourceList) && sourceList.length > 0 ? (
                  sourceList.map((source, index) => {
                    const isActive = source?.sourceLink === selectedInputSource?.sourceLink;
                    return (
                      <div
                        className={`source-list-item ${isActive ? "active" : ""}`}
                        key={index}
                      >
                        <div
                          className="source-item-left"
                          onClick={() => {
                            setSelectedInputSource(source);
                            setBaseDataKeys([]);
                          }}
                        >
                          <div className={`custom-radio ${isActive ? "active" : ""}`}>
                            {isActive && <div className="custom-radio-inner" />}
                          </div>
                          <span className="source-link-item">
                            {getSourceShortLink(source?.sourceLink)}
                          </span>
                        </div>
                        <div className="source-item-right">                          <Button
                          size="small"
                          variant="outlined"
                          onClick={(e) => {
                            e.stopPropagation();
                            onClickViewSource(source?.sourceLink);
                          }}
                          sx={{
                            borderRadius: "20px",
                            px: 1.5,
                            py: 0.5,
                            minWidth: "auto",
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            textTransform: "none",
                            whiteSpace: "nowrap",
                            borderColor: "var(--color-outline-variant)",
                            color: "var(--color-on-surface-variant)",
                            "&:hover": {
                              borderColor: "var(--color-tertiary)",
                              color: "var(--color-tertiary)",
                              bgcolor: "transparent"
                            }
                          }}
                        >
                          View
                        </Button>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedInputSource(source);
                              setBaseDataKeys([]);
                              setShowDeleteSourcePopup(true);
                            }}
                            sx={{
                              p: 0.5,
                              "&:hover": { backgroundColor: "rgba(236, 124, 138, 0.1)" }
                            }}
                          >
                            <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div>No data</div>
                )}
              </div>

              <div className="add-chart-next-button-container" style={{ justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  disabled={!selectedInputSource?.sourceLink}
                  onClick={() => handleNavSection(2)}
                  className="btn-pill-primary"
                  sx={{
                    bgcolor: "var(--color-tertiary)",
                    "&:hover": { bgcolor: "var(--color-tertiary)", opacity: 0.9 }
                  }}
                >
                  Confirm Source & Proceed
                </Button>
              </div>
            </section>
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={expanded === 2} disabled={false}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon className="expand-icon" />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <CustomTitle count={2}>Select Chart Type</CustomTitle>
          </AccordionSummary>
          <AccordionDetails>
            {/* select chart type */}
            <section className="section-container" id="section-container-2">
              <div className="chart-select-row" style={{ paddingTop: '8px' }}>
                <div className="chart-selector" style={{ width: '100%' }}>
                  <CustomDropdown
                    options={chartList.map(chart => ({
                      value: chart.type,
                      label: chart.label,
                      disabled: !chart.active
                    }))}
                    value={selectedChart}
                    onChange={(val) => handleChartOption(val)}
                    placeholder="Select Chart Type"
                  />
                </div>
              </div>

              <div className="add-chart-next-button-container" style={{ justifyContent: "flex-end" }}>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button
                    color="inherit"
                    onClick={() => {
                      setShowConfirmPopup(true);
                      // goToBackwardFromStep(2, true);
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    disabled={selectedChart === ""}
                    onClick={() => {
                      handleMapData();
                    }}
                    className="btn-pill-primary"
                    sx={{
                      bgcolor: "var(--color-tertiary)",
                      "&:hover": { bgcolor: "var(--color-tertiary)", opacity: 0.9 }
                    }}
                  >
                    Map Data
                  </Button>
                </Stack>
              </div>
            </section>
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={expanded === 3} disabled={false}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon className="expand-icon" />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <CustomTitle count={3}>
              Map Data for{" "}
              {selectedChart
                ? `<${selectedChart} ${selectedChart === "card" ? "" : "Chart"}>`
                : "<Select Chart Type>"}
              {`<${getSourceEndPoint(selectedInputSource?.sourceLink) || "Select Source Url"}>`}
            </CustomTitle>
          </AccordionSummary>
          <AccordionDetails>
            <section className="section-container" id="section-container-3">
              <MappingData
                parent="dashboard"
                showMappingData={!isLoading}
                mapBaseDataKeys={baseDataKeys}
                mapSelectListItemOne={selectListItemOne}
                mapSelectListItemTwo={selectListItemTwo}
                mapApiAllData={apiAllData}
                mapSelectedChart={selectedChart}
                mapSingleData={singleData}
                mapTableItems={tableItems}
                setMapSelectListItemOne={setSelectListItemOne}
                setMapSelectListItemTwo={setSelectListItemTwo}
                setMapTableItems={setTableItems}
              />
              <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                <Button
                  color="inherit"
                  onClick={() => {
                    setShowConfirmPopup(true);
                    // goToBackwardFromStep(3, true);
                  }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  disabled={tableItems.length === 0 || (selectedChart !== "card" && tableItems.length < 2)}
                  onClick={() => {
                    handleNavSection(4);
                  }}
                  className="btn-pill-primary"
                  sx={{
                    bgcolor: "var(--color-tertiary)",
                    "&:hover": { bgcolor: "var(--color-tertiary)", opacity: 0.9 }
                  }}
                >
                  Show Selected Data In New Chart
                </Button>
              </Stack>
            </section>
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={expanded === 4} disabled={false}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon className="expand-icon" />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <CustomTitle count={4}>Enter Chart/Card Name</CustomTitle>
          </AccordionSummary>
          <AccordionDetails>
            <section className="section-container" id="section-container-4" style={{ paddingTop: '8px' }}>
              <div className="chart-name-form" style={{ width: '100%', marginBottom: '16px' }}>
                <Typography variant="caption" sx={{ color: 'var(--color-on-surface-variant)', mb: 0.5, display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, fontSize: '0.7rem' }}>
                  Display Name
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  className="chart-name-input"
                  placeholder="e.g. Monthly Revenue"
                  value={newConfigName}
                  onChange={(e) => setNewConfigName(e.target.value)}
                  inputProps={{
                    "aria-label": "Chart Name",
                  }}
                  sx={{
                    backgroundColor: "var(--color-surface-container-highest)",
                    borderRadius: "12px",
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "var(--color-outline-variant)", borderWidth: '1px' },
                      "&:hover fieldset": { borderColor: "var(--color-on-surface-variant)" },
                      "&.Mui-focused fieldset": { borderColor: "var(--color-tertiary)", borderWidth: '2px' },
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: 'var(--color-on-surface-variant)',
                      opacity: 0.6,
                      fontSize: '0.875rem'
                    }
                  }}
                />
              </div>

              <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                <Button
                  color="primary"
                  onClick={() => {
                    setShowConfirmPopup(true);
                    // goToBackwardFromStep(4, true);
                  }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  disabled={tableItems.length === 0 || (selectedChart !== "card" && tableItems.length < 2) || !newConfigName.trim()}
                  onClick={() => {
                    handleAddNewChart();
                  }}
                  className="btn-pill-primary"
                  sx={{
                    bgcolor: "var(--color-tertiary)",
                    "&:hover": { bgcolor: "var(--color-tertiary)", opacity: 0.9 }
                  }}
                >
                  Publish {" "}
                  {selectedChart === "card"
                    ? "Card"
                    : `${selectedChart.charAt(0).toUpperCase() + selectedChart.slice(1)} Chart To Dashboard`}
                </Button>
              </Stack>
              <br />
            </section>
          </AccordionDetails>
        </Accordion>
      </Stack>

      <Dialog
        open={showConfirmPopup}
        onClose={() => {
          setShowConfirmPopup(false);
        }}
        PaperProps={{
          sx: {
            padding: "24px",
            borderRadius: '24px',
            backgroundColor: 'var(--color-surface-container-high)',
            backgroundImage: 'none',
            border: '1px solid var(--color-outline-variant)',
            p: 1,
            maxHeight: "90vh",
            overflowY: "auto"
          }
        }}
      >
        <DialogTitle sx={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '1.25rem' }}>
          Are You Sure?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'var(--color-on-surface-variant)', fontWeight: 500 }}>
            Going backward may delete step ({expanded}) details
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
            <Button
              fullWidth
              sx={{
                borderRadius: '12px',
                color: 'var(--color-on-surface-variant)',
                fontWeight: 600,
                textTransform: 'none',
              }}
              onClick={() => {
                setShowConfirmPopup(false);
              }}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="error"
              sx={{
                borderRadius: '12px',
                fontWeight: 700,
                textTransform: 'none',
              }}
              onClick={() => {
                setShowConfirmPopup(false);
                goToBackwardFromStep(expanded, true);
              }}
            >
              Yes, Confirm
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function CustomTitle({ count, children }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <div className="number-counter">{count}</div>
      <Typography
        sx={{
          fontFamily: "var(--font-headline)",
          fontWeight: 800,
          fontSize: { xs: "1.125rem", sm: "1.25rem" },
          color: "var(--color-on-surface)",
          letterSpacing: "-0.01em"
        }}
      >
        {children}
      </Typography>
    </Stack>
  );
}
