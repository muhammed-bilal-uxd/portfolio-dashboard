import React, { useState, useMemo } from "react";
import Modal from "./Modal";
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
import DeliveryCards from "./Delivery-cards";

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

import "./Dashboard.css";

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(false);

  // ✅ one modal for all charts
  const [modalOpen, setModalOpen] = useState(false);
  const [activeChart, setActiveChart] = useState(null); // { type, title, data, options }

  // 🎨 Theme colors
  const theme = useMemo(() => {
    return darkMode
      ? {
          bg: "#0f172a",
          card: "#1e293b",
          text: "#ffffff",
          subText: "#94a3b8",
          grid: "rgba(255,255,255,0.1)",
          modelBg: "rgb(30, 41, 59)",
        }
      : {
          bg: "#f8fafc",
          card: "#ffffff",
          text: "#0f172a",
          subText: "#64748b",
          grid: "rgba(0,0,0,0.08)",
          modelBg: "#fff",
        };
  }, [darkMode]);

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

  const lineData = {
    labels,
    datasets: [
      {
        label: "Visits",
        data: [120, 190, 160, 210, 240, 200, 260],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const barData = {
    labels,
    datasets: [
      {
        label: "Orders",
        data: [12, 19, 15, 22, 28, 20, 30],
        backgroundColor: "#22c55e",
      },
    ],
  };

  const pieData = {
    labels: ["Desktop", "Mobile", "Tablet"],
    datasets: [
      {
        data: [52, 38, 10],
        backgroundColor: ["#3b82f6", "#f97316", "#10b981"],
      },
    ],
  };

  const radarData = {
    labels: ["UX", "UI", "Speed", "SEO", "Content", "Support"],
    datasets: [
      {
        label: "Score",
        data: [78, 82, 74, 69, 80, 76],
        backgroundColor: "rgba(168,85,247,0.2)",
        borderColor: "#a855f7",
      },
    ],
  };

  const polarData = {
    labels: ["A", "B", "C", "D", "E"],
    datasets: [
      {
        data: [11, 16, 7, 14, 10],
        backgroundColor: [
          "#3b82f6",
          "#22c55e",
          "#f97316",
          "#a855f7",
          "#ef4444",
        ],
      },
    ],
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

  const cardStyle = {
    background: theme.card,
    borderRadius: 16,
    padding: 16,
    boxShadow: darkMode
      ? "0 4px 20px rgba(0,0,0,0.4)"
      : "0 4px 20px rgba(0,0,0,0.08)",
    minHeight: 260,
    display: "flex",
    flexDirection: "column",
    cursor: "pointer",
  };

  // ✅ open modal with any chart config
  const openChartModal = ({ type, title, data, options }) => {
    setActiveChart({ type, title, data, options });
    setModalOpen(true);
  };

  // ✅ render correct chart in modal
  const renderChart = (chart) => {
    if (!chart) return null;

    const commonStyle = { height: 420 }; // bigger in modal

    switch (chart.type) {
      case "line":
        return (
          <Line data={chart.data} options={chart.options} style={commonStyle} />
        );
      case "bar":
        return (
          <Bar data={chart.data} options={chart.options} style={commonStyle} />
        );
      case "pie":
        return <Pie data={chart.data} />;
      case "doughnut":
        return <Doughnut data={chart.data} />;
      case "radar":
        return <Radar data={chart.data} />;
      case "polar":
        return <PolarArea data={chart.data} />;
      case "bubble":
        return (
          <Bubble
            data={chart.data}
            options={chart.options}
            style={commonStyle}
          />
        );
      case "scatter":
        return (
          <Scatter
            data={chart.data}
            options={chart.options}
            style={commonStyle}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        background: theme.bg,
        minHeight: "100vh",
        padding: 24,
        transition: "0.3s",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h1 style={{ color: theme.text }}>Dashboard</h1>

        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
            background: darkMode ? "#facc15" : "#1e293b",
            color: darkMode ? "#000" : "#fff",
          }}
        >
          {darkMode ? "🌞 Day Mode" : "🌙 Night Mode"}
        </button>
      </div>

      <DeliveryCards />

      {/* Grid */}
      <div className="grid-container">
        <div
          className="grid-item"
          style={cardStyle}
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

        <div
          style={cardStyle}
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

        <div
          style={cardStyle}
          onClick={() =>
            openChartModal({
              type: "pie",
              title: "Traffic Split",
              data: pieData,
              options: null,
            })
          }
        >
          <Pie data={pieData} />
        </div>

        <div
          style={cardStyle}
          onClick={() =>
            openChartModal({
              type: "radar",
              title: "Performance Score",
              data: radarData,
              options: null,
            })
          }
        >
          <Radar data={radarData} />
        </div>

        <div
          style={cardStyle}
          onClick={() =>
            openChartModal({
              type: "polar",
              title: "Category Spread",
              data: polarData,
              options: null,
            })
          }
        >
          <PolarArea data={polarData} />
        </div>

        <div
          style={cardStyle}
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

        <div
          style={cardStyle}
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

        <div
          style={cardStyle}
          onClick={() =>
            openChartModal({
              type: "doughnut",
              title: "Traffic Split (Doughnut)",
              data: pieData,
              options: null,
            })
          }
        >
          <Doughnut data={pieData} />
        </div>

        <div
          style={cardStyle}
          onClick={() =>
            openChartModal({
              type: "bar",
              title: "Orders (Copy)",
              data: barData,
              options: baseOptions("Orders (Copy)"),
            })
          }
        >
          <Bar data={barData} options={baseOptions()} />
        </div>
      </div>

      {/* ✅ One modal for all charts */}
      <Modal
        theme={theme}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setActiveChart(null);
        }}
      >
        {activeChart?.title ? (
          <h3 style={{ margin: "0 0 12px", color: theme.text }}>
            {activeChart.title}
          </h3>
        ) : null}
        <div style={{ height: 460, maxHeight: "80vh" }}>
          {renderChart(activeChart)}
        </div>
      </Modal>
    </div>
  );
}
