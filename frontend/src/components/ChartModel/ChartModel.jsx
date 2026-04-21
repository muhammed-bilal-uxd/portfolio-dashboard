import * as React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import {
  Line,
  Bar,
  Pie,
  Doughnut,
  Radar,
  PolarArea,
  Bubble,
  Scatter,
} from "react-chartjs-2";

import "./ChartModel.css";
import { useEffect, useState } from "react";
import Modal from "../Modal/Modal";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
);

import MoreVertIcon from "@mui/icons-material/MoreVert";

// mui/material
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Menu,
  MenuItem,
  FilledInput,
  Stack,
} from "@mui/material";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import MappingData from "../MappingData/MappingData";

import EditIcon from "@mui/icons-material/Edit";
import StorageIcon from "@mui/icons-material/Storage";
import SettingsIcon from "@mui/icons-material/Settings";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

const menuItems = [
  { label: "Edit Chart Name", key: "name", icon: <EditIcon fontSize="small" /> },
  { label: "Edit Chart Data", key: "data", icon: <StorageIcon fontSize="small" /> },
];

const VITE_API_URL = import.meta.env.VITE_API_URL;

export default function ChartModel({ configData, dataIndex }) {
  const [activeChart, setActiveChart] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedChart, setSelectedChart] = useState("");
  const [showNamePopup, setShowNamePopup] = useState(false);
  const [newConfigName, setNewConfigName] = useState("");
  const [configName, setConfigName] = useState("");
  const [showEditChartPopup, setShowEditChartPopup] = useState(false);
  const [localConfigData, setLocalConfigData] = useState(configData);
  const [canShowChart, setCanShowChart] = useState(false);

  // chart edit popup
  const [selectListItemOne, setSelectListItemOne] = useState(
    localConfigData?.data?.selectListItemOne || "",
  );
  const [selectListItemTwo, setSelectListItemTwo] = useState(
    localConfigData?.data?.selectListItemTwo || "",
  );
  const [tableItems, setTableItems] = useState(
    localConfigData?.data?.tableItems || [],
  );

  // useEffect(() => {
  //   if (dataIndex === 0) onLoad();
  // }, [localConfigData]);

  // const onLoad = () => {
  //   setShowEditChartPopup(true);
  // };

  useEffect(() => {
    setSelectedChart(localConfigData?.data?.chartType || "");
    setConfigName(localConfigData?.configName || "");
    setTableItems;
  }, [localConfigData]);

  const openChartModal = ({ type, title, data, options }) => {
    setActiveChart({ type, title, data, options });
    setModalOpen(true);
  };

  const getChartCssVar = (name, fallback) => {
    if (typeof window === "undefined") return fallback;

    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();

    return value || fallback;
  };

  const baseOptions = (title) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: getChartCssVar("--chart-model-text", "#111827"),
        },
      },
      title: {
        display: !!title,
        text: title,
        color: getChartCssVar("--chart-model-text", "#111827"),
      },
    },
    scales: {
      x: {
        ticks: {
          color: getChartCssVar("--chart-model-text", "#111827"),
        },
        grid: {
          color: getChartCssVar(
            "--chart-model-grid-color",
            "rgba(0,0,0,0.08)",
          ),
        },
      },
      y: {
        ticks: {
          color: getChartCssVar("--chart-model-text", "#111827"),
        },
        grid: {
          color: getChartCssVar(
            "--chart-model-grid-color",
            "rgba(0,0,0,0.08)",
          ),
        },
      },
    },
  });

  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const randomColor = () => `hsl(${Math.floor(Math.random() * 360)},70%,60%)`;

  const lineData = {
    labels:
      (Array.isArray(localConfigData?.data?.chartData) &&
        localConfigData?.data?.chartData.map((i, j) => i.label)) ||
      [],
    datasets: [
      {
        label: localConfigData?.data?.selectListItemOne,
        data:
          (Array.isArray(localConfigData?.data?.chartData) &&
            localConfigData?.data?.chartData.map((i, j) => i.value)) ||
          [],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const barData = {
    labels: [
      ...((Array.isArray(localConfigData?.data?.chartData) &&
        localConfigData?.data?.chartData.map((i, j) => i.label)) ||
        []),
    ],
    datasets: [
      {
        label: localConfigData?.data?.selectListItemOne || "",
        data: [
          ...((Array.isArray(localConfigData?.data?.chartData) &&
            localConfigData?.data?.chartData.map((i, j) => i.value)) ||
            []),
        ],
        backgroundColor: randomColor(),
      },
    ],
  };

  // const generateRandomColors =

  const pieData = () => {
    const bgColors =
      Array.isArray(
        Array.isArray(localConfigData?.data?.chartData) &&
          localConfigData?.data?.chartData.map((i, j) => i.label),
      ) && labels.map((label, l) => randomColor());

    return {
      labels:
        (Array.isArray(localConfigData?.data?.chartData) &&
          localConfigData?.data?.chartData.map((i, j) => i.label)) ||
        [],
      datasets: [
        {
          data: [
            ...((Array.isArray(localConfigData?.data?.chartData) &&
              localConfigData?.data?.chartData.map((i, j) => i.value)) ||
              []),
          ],
          backgroundColor: [...bgColors],
        },
      ],
    };
  };

  const radarData = () => {
    return {
      labels: [
        ...((Array.isArray(localConfigData?.data?.chartData) &&
          localConfigData?.data?.chartData.map((i, j) => i.label)) ||
          []),
      ],
      datasets: [
        {
          label: "Score",
          data: [
            ...((Array.isArray(localConfigData?.data?.chartData) &&
              localConfigData?.data?.chartData.map((i, j) => i.value)) ||
              []),
          ],
          backgroundColor: "rgba(168,85,247,0.2)",
          borderColor: "#a855f7",
        },
      ],
    };
  };

  const polarData = () => {
    const colors =
      Array.isArray(localConfigData?.data?.chartData) &&
      localConfigData?.data?.chartData.map((data, d) => randomColor());

    return {
      labels: [
        ...((Array.isArray(localConfigData?.data?.chartData) &&
          localConfigData?.data?.chartData.map((i, j) => i.label)) ||
          []),
      ],
      datasets: [
        {
          data: [
            ...((Array.isArray(localConfigData?.data?.chartData) &&
              localConfigData?.data?.chartData.map((i, j) => i.value)) ||
              []),
          ],
          backgroundColor: [...colors],
        },
      ],
    };
  };

  const bubbleData = {
    datasets: [
      {
        label: "Campaigns",
        data: [
          { x: 5, y: 12, r: 10 },
          { x: 9, y: 7, r: 14 },
          { x: 13, y: 16, r: 9 },
        ],
        backgroundColor: "#06b6d4",
      },
    ],
  };

  const scatterData = {
    datasets: [
      {
        label: "Spend vs Conversion",
        data: [
          { x: 200, y: 2.1 },
          { x: 400, y: 2.9 },
          { x: 650, y: 3.4 },
        ],
        borderColor: "#f43f5e",
      },
    ],
  };

  const renderChart = (chart) => {
    if (!chart) return null;

    switch (chart.type) {
      case "line":
        return <Line data={chart?.chartData} options={chart?.options} />;
      case "bar":
        return <Bar data={chart?.chartData} options={chart?.options} />;
      case "pie":
        return <Pie data={chart?.chartData} />;
      case "doughnut":
        return <Doughnut data={chart?.chartData} />;
      case "radar":
        return <Radar data={chart?.chartData} />;
      case "polar":
        return <PolarArea data={chart?.chartData} />;
      case "bubble":
        return <Bubble data={chart?.chartData} options={chart?.options} />;
      case "scatter":
        return <Scatter data={chart?.chartData} options={chart?.options} />;
      default:
        return null;
    }
  };

  const handleMenuItem = (a) => {
    switch (a) {
      case "name":
        setNewConfigName(configName);
        setShowNamePopup(true);
        break;
      case "data":
        setShowEditChartPopup(true);
        break;
      default:
        break;
    }
  };

  const handleChangeMappingDetails = async (payload) => {
    console.log("payload", payload);

    try {
      const url =
        VITE_API_URL + `/project-chart?chartId=${localConfigData?._id}`;
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const response = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          response?.message || `Request failed with status ${res.status}`,
        );
      }

      if (payload?.configName) {
        setConfigName(newConfigName);
      } else {
        const newData = {
          ...localConfigData.data,
          chartData: payload?.chartData,
          selectListItemOne: payload?.selectListItemOne,
          selectListItemTwo: payload?.selectListItemTwo,
        };

        setLocalConfigData({
          ...localConfigData,
          data: newData,
        });
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSaveChartData = () => {
    setShowEditChartPopup(false);

    const chartData =
      Array.isArray(tableItems) &&
      tableItems.map((i) => {
        return {
          label: localConfigData?.data?.apiAllData[i][selectListItemOne],
          value: localConfigData?.data?.apiAllData[i][selectListItemTwo],
        };
      });

    handleChangeMappingDetails({
      chartData,
      selectListItemOne: selectListItemOne,
      selectListItemTwo: selectListItemTwo,
    });
  };

  // div start
  return (
    <div className="chart-model-container">
      <div>
        <div className="chart-model-header">
          <h3 className="chart-model-title">
            {configName} (
            {localConfigData?.data?.chartType === "card"
              ? "card"
              : `${localConfigData?.data?.chartType} chart`}
            )
          </h3>
          <div>
            <PopupState variant="popover" popupId="demo-popup-menu">
              {(popupState) => (
                <React.Fragment>
                  {/* <Button variant="contained" {...bindTrigger(popupState)}>
                    Dashboard
                  </Button> */}
                  <IconButton {...bindTrigger(popupState)}>
                    <MoreVertIcon className="chart-model-more-vertical-icon" />
                  </IconButton>
                  <Menu
                    {...bindMenu(popupState)}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    slotProps={{
                      paper: {
                        sx: {
                          backgroundColor: "rgba(25, 26, 26, 0.8)",
                          backdropFilter: "blur(20px)",
                          borderRadius: "12px",
                          border: "1px solid var(--color-outline-variant)",
                          boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5)",
                          minWidth: '200px',
                          mt: 1,
                          padding: '4px'
                        },
                      },
                    }}
                  >
                    {menuItems.map((menu, i) => {
                      return (
                        <MenuItem
                          key={i}
                          onClick={() => {
                            popupState.close();
                            handleMenuItem(menu?.key);
                          }}
                          sx={{
                            borderRadius: '8px',
                            margin: '2px 0',
                            padding: '8px 12px',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.05)',
                              transform: 'translateX(4px)'
                            }
                          }}
                        >
                          <ListItemIcon sx={{ color: 'var(--color-on-surface-variant)', minWidth: '36px !important' }}>
                            {menu.icon}
                          </ListItemIcon>
                          <ListItemText 
                            primary={menu.label} 
                            primaryTypographyProps={{ 
                              fontSize: '14px', 
                              fontWeight: 500,
                              color: 'var(--color-on-surface)'
                            }} 
                          />
                        </MenuItem>
                      );
                    })}
                  </Menu>
                </React.Fragment>
              )}
            </PopupState>
          </div>
        </div>

        <div className="grid-container">
          {selectedChart === "card" && (
            <div>
              <div className="chart-model-card-preview">
                <h3 className="chart-model-card-label">
                  {localConfigData?.data?.chartData[0].label}
                </h3>

                <p className="chart-model-card-value">
                  {localConfigData?.data?.chartData[0].value}
                </p>
              </div>
            </div>
          )}

          {selectedChart === "line" && (
            <div
              className="grid-item chart-card"
              onClick={() =>
                canShowChart &&
                openChartModal({
                  type: "line",
                  title: "Visits (Weekly)",
                  data: lineData,
                  options: baseOptions("Visits (Weekly)"),
                })
              }
            >
              <Line data={lineData} options={baseOptions()} />
            </div>
          )}

          {selectedChart === "bar" && (
            <div
              className="chart-card"
              onClick={() =>
                canShowChart &&
                openChartModal({
                  type: "bar",
                  title: "Orders (Weekly)",
                  data: barData,
                  options: baseOptions("Orders (Weekly)"),
                })
              }
            >
              <Bar data={barData} options={baseOptions()} />
            </div>
          )}

          {selectedChart === "pie" && (
            <div
              className="chart-card"
              onClick={() =>
                canShowChart &&
                openChartModal({
                  type: "pie",
                  title: "Traffic Split",
                  data: pieData(),
                  options: null,
                })
              }
            >
              <Pie data={pieData()} />
            </div>
          )}

          {selectedChart === "radar" && (
            <div
              className="chart-card"
              onClick={() =>
                canShowChart &&
                openChartModal({
                  type: "radar",
                  title: "Performance Score",
                  data: radarData(),
                  options: null,
                })
              }
            >
              <Radar data={radarData()} />
            </div>
          )}

          {selectedChart === "polar" && (
            <div
              className="chart-card"
              onClick={() =>
                canShowChart &&
                openChartModal({
                  type: "polar",
                  title: "Category Spread",
                  data: polarData(),
                  options: null,
                })
              }
            >
              <PolarArea data={polarData()} />
            </div>
          )}

          {selectedChart === "bubble" && (
            <div
              className="chart-card"
              onClick={() =>
                canShowChart &&
                openChartModal({
                  type: "bubble",
                  title: "Campaigns",
                  data: bubbleData,
                  options: baseOptions("Campaigns"),
                })
              }
            >
              <Bubble data={bubbleData} options={baseOptions()} />
            </div>
          )}

          {selectedChart === "scatter" && (
            <div
              className="chart-card"
              onClick={() =>
                canShowChart &&
                openChartModal({
                  type: "scatter",
                  title: "Spend vs Conversion",
                  data: scatterData,
                  options: baseOptions("Spend vs Conversion"),
                })
              }
            >
              <Scatter data={scatterData} options={baseOptions()} />
            </div>
          )}

          {selectedChart === "doughnut" && (
            <div
              className="chart-card"
              onClick={() =>
                canShowChart &&
                openChartModal({
                  type: "doughnut",
                  title: "Traffic Split (Doughnut)",
                  data: pieData(),
                  options: null,
                })
              }
            >
              <Doughnut data={pieData()} />
            </div>
          )}
        </div>

        {modalOpen && (
          <Modal
            isOpen={modalOpen}
            onClose={() => {
              setModalOpen(false);
              setActiveChart(null);
            }}
          >
            {activeChart?.title ? (
              <h3 className="modal-chart-title">{activeChart.title}</h3>
            ) : null}
            <div className="modal-chart-container">
              {renderChart(activeChart)}
            </div>
          </Modal>
        )}
      </div>

      <Dialog
        open={showNamePopup}
        onClose={() => {
          setShowNamePopup(false);
        }}
      >
        <DialogTitle>Change Chart Name</DialogTitle>
        <DialogContent>
          <FilledInput
            className="chart-model-name-input"
            type="text"
            placeholder="Enter name"
            value={newConfigName}
            onChange={(e) => setNewConfigName(e.target.value)}
          />
          {/* {newConfigName} */}
        </DialogContent>
        <DialogActions>
          <Stack direction="row" spacing={1}>
            <Button
              color="inherit"
              onClick={() => {
                setShowNamePopup(false);
              }}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                setShowNamePopup(false);
                handleChangeMappingDetails({ configName: newConfigName });
              }}
            >
              Save
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>

      <Dialog
        fullWidth={true}
        maxWidth={"md"}
        open={showEditChartPopup}
        onClose={() => {
          setShowEditChartPopup(false);
        }}
      >
        <DialogTitle>Edit Mapping Data</DialogTitle>
        <DialogContent>
          <MappingData
            parent={"chart"}
            showMappingData={true}
            mapBaseDataKeys={localConfigData?.data?.baseDataKeys}
            mapApiAllData={localConfigData?.data?.apiAllData}
            mapSelectedChart={localConfigData?.data?.chartType}
            mapSingleData={localConfigData?.data?.singleData}
            mapSelectListItemOne={selectListItemOne}
            mapSelectListItemTwo={selectListItemTwo}
            mapTableItems={tableItems}
            setMapSelectListItemOne={setSelectListItemOne}
            setMapSelectListItemTwo={setSelectListItemTwo}
            setMapTableItems={setTableItems}
          />
        </DialogContent>
        <DialogActions>
          <Stack direction="row" spacing={1}>
            <Button
              color="inherit"
              onClick={() => {
                setShowEditChartPopup(false);
              }}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                handleSaveChartData();
              }}
            >
              Save
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </div>
  );
}
