// dependencies
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// components
import ChartModel from "../ChartModel/ChartModel";

// css
import "./AddNewChart.css";
import Modal from "../Modal/Modal";
import MappingData from "../MappingData/MappingData";
import { useLoading } from "../../context/LoadingContext";

import { checkTypeOfData } from "../../utils/common";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Stack } from "@mui/material";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
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
    <div className="dashboard-root">
      {/* tittle */}
      <div className="dashboard-header">
        <ArrowBackIcon
          className="arrow-back"
          onClick={() => {
            navigate(`/dashboard/${projectId}`);
          }}
        />
        <h1 className="dashboard-title">
          Add New Chart - {projectDetail?.name || "<project name>"}
        </h1>
      </div>
      {/* expand index = {expanded} */}
      <Stack spacing={2}>
        <Accordion expanded={expanded === 1} disabled={false}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <CustomTitle count={1}>Paste rest data Url</CustomTitle>
          </AccordionSummary>
          <AccordionDetails>
            <section className="section-container" id="section-container-1">
              {/* <b className="step-name">step : 1</b> */}

              {/* <h3>Paste rest data Url:</h3> */}
              <div className="source-input-row">
                <input
                  className="input-source-url"
                  type="text"
                  onChange={(e) => setInputSource(e.target.value)}
                  placeholder="URL here..."
                  value={inputSource}
                />
                <button onClick={() => handleAddSource()}>add</button>
              </div>

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
                      <div>
                        <div className={"pop-title"}>source link </div>
                        {sourceLinkPopupConfig?.sourceLink}
                      </div>

                      <div>
                        <div className={"pop-title"}> preview source data </div>
                      </div>
                      <pre className="source-preview-json">
                        {JSON.stringify(sourcePreview.data, null, 4)}
                      </pre>
                      {!sourceLinkPopupConfig?.isView && (
                        <>
                          <div className="source-save-row">
                            <span className="source-save-spacer"></span>
                            <button onClick={() => handleSaveSource()}>
                              save link as source
                            </button>
                          </div>
                        </>
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
                  <div className="source-delete-actions">
                    <button onClick={() => setShowDeleteSourcePopup(false)}>
                      cancel
                    </button>
                    <button
                      onClick={() => {
                        removeSource(selectedInputSource);
                        setShowDeleteSourcePopup(false);
                      }}
                    >
                      confirm yes
                    </button>
                  </div>
                </Modal>
              )}

              <h3>select source</h3>
              <div className="source-list">
                {Array.isArray(sourceList) && sourceList.length > 0 ? (
                  sourceList.map((source, index) => (
                    <div
                      className={
                        "source-list-item" +
                        (source?.sourceLink === selectedInputSource?.sourceLink
                          ? " active"
                          : "")
                      }
                      key={index}
                    >
                      <div className="source-item-main">
                        <span
                          onClick={() => {
                            setSelectedInputSource(source);
                            setBaseDataKeys([]);
                          }}
                        >
                          <input
                            type="radio"
                            readOnly
                            checked={
                              source?.sourceLink ===
                              selectedInputSource?.sourceLink
                            }
                          />
                          {getSourceShortLink(source?.sourceLink)} ...
                        </span>
                        <span
                          className="source-item-action"
                          onClick={() => onClickViewSource(source?.sourceLink)}
                        >
                          {" "}
                          - view data
                        </span>
                      </div>
                      <div
                        className="source-item-delete"
                        onClick={() => {
                          setSelectedInputSource(source);
                          setBaseDataKeys([]);
                          setShowDeleteSourcePopup(true);
                          // removeSource(source);
                        }}
                      >
                        X
                      </div>
                    </div>
                  ))
                ) : (
                  <div>No data</div>
                )}
              </div>

              <div className="next-button-container">
                <button onClick={() => handleNavSection(2)}>
                  select chart type
                </button>
              </div>
            </section>
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={expanded === 2} disabled={false}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <CustomTitle count={2}>Select chart type</CustomTitle>
          </AccordionSummary>
          <AccordionDetails>
            {/* select chart type */}
            <section className="section-container" id="section-container-2">
              <div className="chart-select-row">
                <div className="chart-selector">
                  <select
                    value={selectedChart}
                    onChange={(e) => {
                      handleChartOption(e.target.value);
                    }}
                  >
                    <option value="" disabled>
                      Select Option
                    </option>
                    {chartList.map((chart) => (
                      <option
                        key={chart.type}
                        value={chart.type}
                        disabled={!chart.active}
                      >
                        {chart.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="next-button-container">
                <button
                  onClick={() => {
                    setShowConfirmPopup(true);
                    // goToBackwardFromStep(2, true);
                  }}
                >
                  back
                </button>
                <button
                  disabled={selectedChart === ""}
                  onClick={() => {
                    handleMapData();
                  }}
                >
                  map data
                </button>
              </div>
            </section>
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={expanded === 3} disabled={false}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <CustomTitle count={3}>
              map data for{" "}
              {selectedChart
                ? `<${selectedChart} ${selectedChart === "card" ? "" : "chart"}>`
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
              <div>
                <button
                  onClick={() => {
                    setShowConfirmPopup(true);
                    // goToBackwardFromStep(3, true);
                  }}
                >
                  back
                </button>
                <button
                  onClick={() => {
                    if (selectedChart !== "card" && tableItems.length < 2) {
                      alert("In mapping data : At least select two option");
                      return;
                    }
                    handleNavSection(4);
                  }}
                >
                  Go to Enter new chart/card name
                </button>
              </div>
            </section>
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={expanded === 4} disabled={false}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <CustomTitle count={4}>Enter your new chart/card name:</CustomTitle>
          </AccordionSummary>
          <AccordionDetails>
            <section className="section-container" id="section-container-4">
              <div className="chart-name-form">
                <input
                  className="chart-name-input"
                  type="text"
                  placeholder="Enter name"
                  value={newConfigName}
                  onChange={(e) => setNewConfigName(e.target.value)}
                />
              </div>

              <div>
                <button
                  onClick={() => {
                    setShowConfirmPopup(true);
                    // goToBackwardFromStep(4, true);
                  }}
                >
                  back
                </button>
                <button
                  onClick={() => {
                    if (selectedChart !== "card" && tableItems.length < 2) {
                      alert("In mapping data : At least select two option");
                      return;
                    }
                    handleAddNewChart();
                  }}
                >
                  publish new{" "}
                  {selectedChart === "card"
                    ? "card"
                    : `${selectedChart} chart to dashboard`}
                </button>
              </div>
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
      >
        <DialogTitle>Are You Sure?</DialogTitle>
        <DialogContent>
          Going backward may delete step ({expanded}) details
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowConfirmPopup(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setShowConfirmPopup(false);
              goToBackwardFromStep(expanded, true);
            }}
            variant="contained"
          >
            Yes, Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function CustomTitle({ count, children }) {
  return (
    <Stack direction="row" spacing={1}>
      <div className="number-counter">{count}</div>
      <Typography
        variant="h6"
        component="h6"
        sx={{ width: "100%", flexShrink: 0 }}
      >
        {children}
      </Typography>
    </Stack>
  );
}
