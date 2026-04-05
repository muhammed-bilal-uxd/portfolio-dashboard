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
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "../../pages/ThemeContext/ThemeContext";
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

export default function ChartModel({ configData }) {
  const { theme: themeArray } = useTheme();
  const theme = themeArray;
  const [activeChart, setActiveChart] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedChart, setSelectedChart] = useState("");
  //   const [dataValues, setDataValues] = useState({
  //     labels: ["Desktop", "Mobile", "Tablet"],
  //     values: [52, 38, 10],
  //   });
  //   const [dataValues, setDataValues] = useState(configData?.chartDataValues);

  useEffect(() => {
    setSelectedChart(configData?.chartType);
  }, []);

  const openChartModal = ({ type, title, data, options }) => {
    setActiveChart({ type, title, data, options });
    setModalOpen(true);
  };

  const baseOptions = (title) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: theme.text },
      },
      title: { display: !!title, text: title, color: theme.text },
    },
    scales: {
      x: {
        ticks: { color: theme.text },
        grid: { color: theme.grid },
      },
      y: {
        ticks: { color: theme.text },
        grid: { color: theme.grid },
      },
    },
  });

  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const randomColor = () => `hsl(${Math.floor(Math.random() * 360)},70%,60%)`;

  const lineData = {
    labels: configData?.chartData.map((i) => i.label) || [],
    datasets: [
      {
        label: configData?.selectListItemOne,
        data: configData?.chartData.map((i) => i.value) || [],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const barData = {
    labels: [...(configData?.chartData.map((i) => i.label) || [])],
    datasets: [
      {
        label: configData?.selectListItemOne || "",
        data: [...(configData?.chartData.map((i) => i.value) || [])],
        backgroundColor: randomColor(),
      },
    ],
  };

  // const generateRandomColors =

  const pieData = () => {
    const bgColors =
      Array.isArray(configData?.chartData.map((i) => i.label)) &&
      labels.map(() => randomColor());

    return {
      labels: configData?.chartData.map((i) => i.label) || [],
      datasets: [
        {
          data: [...(configData?.chartData.map((i) => i.value) || [])],
          backgroundColor: [...bgColors],
        },
      ],
    };
  };

  const radarData = () => {
    return {
      labels: [...(configData?.chartData.map((i) => i.label) || [])],
      datasets: [
        {
          label: "Score",
          data: [...(configData?.chartData.map((i) => i.value) || [])],
          backgroundColor: "rgba(168,85,247,0.2)",
          borderColor: "#a855f7",
        },
      ],
    };
  };

  const polarData = () => {
    const colors = configData?.chartData.map(() => randomColor());

    return {
      labels: [...(configData?.chartData.map((i) => i.label) || [])],
      datasets: [
        {
          data: [...(configData?.chartData.map((i) => i.value) || [])],
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

  return (
    <>
      <div>
        <h3>
          {configData?.configName}(
          {configData?.chartType === "card"
            ? "card"
            : `${configData?.chartType} chart`}
          )
        </h3>
        <div className="grid-container">
          {selectedChart === "card" && (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "16px",
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  background: "#fff",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <h3
                  style={{
                    margin: "0 0 0 0",
                    fontSize: "16px",
                    color: "#555",
                  }}
                >
                  {configData?.chartData[0].label}
                </h3>

                <p
                  style={{
                    margin: 0,
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#111",
                  }}
                >
                  {configData?.chartData[0].value}
                </p>
              </div>
            </div>
          )}

          {selectedChart === "line" && (
            <div
              className="grid-item chart-card"
              onClick={() =>
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
    </>
  );
}
