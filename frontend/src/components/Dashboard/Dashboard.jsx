// dependencies
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// components
import ChartModel from "../ChartModel/ChartModel";

// css
import "./Dashboard.css";
import Modal from "../Modal/Modal";
import MappingData from "../MappingData/MappingData";
import { useLoading } from "../../context/LoadingContext";

import { checkTypeOfData } from '../../utils/common'

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

export default function Dashboard() {
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
  const { isLoading } = useLoading();

  const { id: projectId } = useParams();

  useEffect(() => {
    onStartLoad();
  }, []);

  const onStartLoad = () => {
    getProjectDetail();
    getAllSources();
    getAllCharts();
  };

  useEffect(() => {
    if (!singleData || !baseDataKeys.length) return;

    const filterLabels = baseDataKeys.filter((name) =>
      checkTypeOfData(singleData[name], 'string'),
    );

    const filterValues = baseDataKeys.filter((name) =>
      checkTypeOfData(singleData[name], 'number'),
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

      getAllCharts();
      handleNavNextSection(5);
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

  const handleNavNextSection = (value) => {
    const id = "section-container-" + value;
    const elementId = document.getElementById(id);

    if (elementId) {
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

    handleNavNextSection(3);
    handleSubmitUrl();
  };

  // dev start
  return (
    <div className="dashboard-root">
      {/* tittle */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          Dashboard - {projectDetail?.name || "<project name>"}
        </h1>
      </div>

      {/* api call input */}
      <section className="section-container" id="section-container-1">
        <b className="step-name">step : 1</b>

        <h3>Paste rest data Url:</h3>
        <div
          style={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            gap: 5,
          }}
        >
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
              <p className="source-preview-error">{sourcePreview.error}</p>
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
                    <div style={{ display: "flex" }}>
                      <span style={{ flex: 1 }}></span>
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
            modelStyle={{ maxWidth: "400px" }}
            isOpen={showDeleteSourcePopup}
            onClose={() => {
              setShowDeleteSourcePopup(false);
            }}
          >
            <h3>Are you sure, want to delete this source</h3>

            <h5 style={{ wordBreak: "break-word", color: "blue" }}>
              {selectedInputSource?.sourceLink}
            </h5>
            <div
              style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}
            >
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
                <div style={{ flex: 1 }}>
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
                        source?.sourceLink === selectedInputSource?.sourceLink
                      }
                    />
                    {getSourceShortLink(source?.sourceLink)} ...
                  </span>
                  <span
                    style={{ color: "red" }}
                    onClick={() => onClickViewSource(source?.sourceLink)}
                  >
                    {" "}
                    - view data
                  </span>
                </div>
                <div
                  style={{ color: "red" }}
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
          <button onClick={() => handleNavNextSection(2)}>
            select chart type
          </button>
        </div>
      </section>

      {/* select chart type */}
      <section className="section-container" id="section-container-2">
        <b className="step-name">step : 2</b>
        <h3>Select chart type:</h3>
        <div
          style={{
            alignItems: "center",
            display: "flex",
            gap: 5,
          }}
        >
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
            disabled=""
            onClick={() => {
              handleMapData();
            }}
          >
            map data
          </button>
        </div>
      </section>

      {/* generate data preview */}
      <section className="section-container" id="section-container-3">
        <b className="step-name">step : 3</b>
        <h3>
          map data for{" "}
          {selectedChart
            ? `<${selectedChart} ${selectedChart === "card" ? "" : "chart"}>`
            : "<Select Chart Type>"}
          {`<${getSourceEndPoint(selectedInputSource?.sourceLink) || "Select Source Url"}>`}
        </h3>
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
              if (selectedChart !== "card" && tableItems.length < 2) {
                alert("In mapping data : At least select two option");
                return;
              }
              handleNavNextSection(4);
            }}
          >
            Go to Enter new chart/card name
          </button>
        </div>
      </section>

      <section className="section-container" id="section-container-4">
        <b className="step-name">step : 4</b>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <h3>Enter your new chart/card name:</h3>
          <input
            type="text"
            placeholder="Enter name"
            value={newConfigName}
            onChange={(e) => setNewConfigName(e.target.value)}
            style={{
              maxWidth: 200,
            }}
          />
        </div>

        <div>
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
      <section className="section-container" id="section-container-5">
        <b className="step-name">step : 5</b>
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
        <button onClick={() => handleNavNextSection(1)}>back to top</button>
      </div>
    </div>
  );
}
