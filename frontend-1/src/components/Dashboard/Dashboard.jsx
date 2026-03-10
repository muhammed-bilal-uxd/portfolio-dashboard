import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "../../pages/ThemeContext/ThemeContext";
import Modal from "../Modal/Modal";
import DeliveryCards from "../DeliveryCards/DeliveryCards";
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

import "./Dashboard.css";

const VITE_API_URL = import.meta.env.VITE_API_URL;

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

export default function Dashboard() {
  const { theme: themeArray } = useTheme();
  const theme = themeArray;

  const [modalOpen, setModalOpen] = useState(false);
  const [activeChart, setActiveChart] = useState(null); // { type, title, data, options }
  const [products, setProducts] = useState([]);
  const [productsKeys, setProductsKeys] = useState([]);
  const [categories, setCategory] = useState([]);
  const [checkboxSelected, setCheckboxSelected] = useState([]);
  const [baseDataKeys, setBaseDataKeys] = useState([]);

  const inputSubmitUrl = useRef(null);

  useEffect(() => {
    getAllProducts();
    // getAllCategories();
  }, []);

  const getAllProducts = async () => {
    try {
      const data = await fetch(VITE_API_URL + "/woocommerce/all");

      if (!data.ok) {
        throw new Error(`Request failed with status ${products.status}`);
      }

      const res = await data.json();

      console.log("data", res);
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
      setProducts([]);
    }
  };

  const getAllCategories = async () => {
    try {
      const categories = await fetch(VITE_API_URL + "/woocommerce/categories");

      if (!categories.ok) {
        throw new Error(`Request failed with status ${categories.status}`);
      }

      const res = await categories.json();

      console.log("categories", res);
      setCategory(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const singleProductKeys = useMemo(() => {
    if (!products || products.length === 0) return [];

    const singleProduct = products[0];
    const keys = [];

    for (const [key, value] of Object.entries(singleProduct)) {
      keys.push(key);
    }

    // setProductsKeys(keys);

    return keys;
  }, [products]);

  const handleCheckboxChange = (key) => {
    setCheckboxSelected(
      (prev) =>
        prev.includes(key)
          ? prev.filter((item) => item !== key) // remove
          : [...prev, key], // add
    );
  };

  const categoryProductCount = useMemo(() => {
    const catList = {};
    const catLabels = [];
    const catValues = [];

    products.forEach((product) => {
      (product?.categories || []).forEach((category) => {
        const categoryName = category?.name;
        if (!categoryName) return;

        catList[categoryName] = (catList[categoryName] || 0) + 1;
      });
    });

    console.log("catlist", catList);

    for (const [key, value] of Object.entries(catList)) {
      catLabels.push(key);
      catValues.push(value);
    }

    return { catList, catLabels, catValues };
  }, [products]);

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
    labels: [...categoryProductCount.catLabels],
    datasets: [
      {
        label: "Category",
        data: [...categoryProductCount.catValues],
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

  const openChartModal = ({ type, title, data, options }) => {
    setActiveChart({ type, title, data, options });
    setModalOpen(true);
  };

  const renderChart = (chart) => {
    if (!chart) return null;

    switch (chart.type) {
      case "line":
        return <Line data={chart.data} options={chart.options} />;
      case "bar":
        return <Bar data={chart.data} options={chart.options} />;
      case "pie":
        return <Pie data={chart.data} />;
      case "doughnut":
        return <Doughnut data={chart.data} />;
      case "radar":
        return <Radar data={chart.data} />;
      case "polar":
        return <PolarArea data={chart.data} />;
      case "bubble":
        return <Bubble data={chart.data} options={chart.options} />;
      case "scatter":
        return <Scatter data={chart.data} options={chart.options} />;
      default:
        return null;
    }
  };

  const handleSubmitUrl = () => {
    const url = inputSubmitUrl.current.value;
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
        throw new Error(`Request failed with status ${products.status}`);
      }

      const res = await data.json();

      if (!res || res.length === 0) return alert("no data from api");

      const singleData = res[0];
      const keys = [];

      for (const [key, value] of Object.entries(singleData)) {
        keys.push(key);
      }

      setBaseDataKeys(keys);

      console.log("data", res);
      // setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
      // setProducts([]);
    }
  };

  return (
    <div className="dashboard-root">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
      </div>

      <input type="text" ref={inputSubmitUrl} />
      <button onClick={() => handleSubmitUrl()}>submit</button>

      {baseDataKeys.map((name) => (
        <div key={name}>
          <input
            type="checkbox"
            checked={checkboxSelected.includes(name)}
            onChange={() => handleCheckboxChange(name)}
          />
          <span>{name}</span>
        </div>
      ))}

      <br />

      <b> {checkboxSelected.join(", ")}</b>

      <br />

      <DeliveryCards />

      <div className="grid-container">
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

        <div
          className="chart-card"
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
          className="chart-card"
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
          className="chart-card"
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

        <div
          className="chart-card"
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
          className="chart-card"
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
        <div className="modal-chart-container">{renderChart(activeChart)}</div>
      </Modal>
    </div>
  );
}
