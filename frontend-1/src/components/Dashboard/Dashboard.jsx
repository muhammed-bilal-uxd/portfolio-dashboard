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

const chartList = [
  { label: "Cards", type: "cards" },
  { label: "Line Chart", type: "line" },
  { label: "Bar Chart", type: "bar" },
  { label: "Pie Chart", type: "pie" },
  { label: "Doughnut Chart", type: "doughnut" },
  { label: "Radar Chart", type: "radar" },
  { label: "Polar Area Chart", type: "polar" },
  { label: "Bubble Chart", type: "bubble" },
  { label: "Scatter Chart", type: "scatter" },
];

export default function Dashboard() {
  const { theme: themeArray } = useTheme();
  const theme = themeArray;

  const [modalOpen, setModalOpen] = useState(false);
  const [activeChart, setActiveChart] = useState(null); // { type, title, data, options }
  const [products, setProducts] = useState([]);
  const [productsKeys, setProductsKeys] = useState([]);
  const [categories, setCategory] = useState([]);
  const [showCheckbox, setShowCheckbox] = useState(false);
  const [checkboxSelected, setCheckboxSelected] = useState([]);
  const [restApiResponse, setRestApiResponse] = useState([]);
  const [selectListItemOne, setSelectListItemOne] = useState("");
  const [selectListItemTwo, setSelectListItemTwo] = useState("");
  const [baseDataKeys, setBaseDataKeys] = useState([]);
  const [singleData, setSingleData] = useState({});
  const [apiAllData, setApiAllData] = useState([]);
  const [selectedChart, setSelectedChart] = useState("");
  const [dataValues, setDataValues] = useState({
    labels: ["Desktop", "Mobile", "Tablet"],
    values: [52, 38, 10],
  });

  const inputSubmitUrl = useRef(null);

  useEffect(() => {
    // getAllProducts();
    // getAllCategories();
  }, []);

  const onClickCheckbox = (value) => {
    let selectedItems = [];
    const isExistValue = checkboxSelected.includes(String(value));

    if (isExistValue) {
      selectedItems = [
        ...checkboxSelected.filter((c) => {
          return c !== String(value);
        }),
      ];
    } else {
      selectedItems = [...checkboxSelected, String(value)];
    }

    setCheckboxSelected(selectedItems);
  };

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

  const randomColor = () => `hsl(${Math.floor(Math.random() * 360)},70%,60%)`;

  const lineData = {
    labels: dataValues.labels,
    datasets: [
      {
        label: selectListItemOne,
        data: dataValues.values,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const barData = {
    labels: [...dataValues.labels],
    datasets: [
      {
        label: selectListItemOne || "",
        data: [...dataValues.values],
        backgroundColor: randomColor(),
      },
    ],
  };

  // const generateRandomColors =

  const pieData = () => {
    const bgColors =
      Array.isArray(dataValues.labels) && labels.map(() => randomColor());

    return {
      labels: dataValues.labels,
      datasets: [
        {
          data: [...dataValues.values],
          backgroundColor: [...bgColors],
        },
      ],
    };
  };

  const radarData = () => {
    return {
      labels: [...dataValues.labels],
      datasets: [
        {
          label: "Score",
          data: [...dataValues.values],
          backgroundColor: "rgba(168,85,247,0.2)",
          borderColor: "#a855f7",
        },
      ],
    };
  };

  const polarData = () => {
    const colors = dataValues.labels.map(() => randomColor());

    return {
      labels: [...dataValues.labels],
      datasets: [
        {
          data: [...dataValues.values],
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

      const firstItem = res[0];
      setSingleData(firstItem);
      setApiAllData(res);
      const keys = Object.keys(firstItem);

      setBaseDataKeys(keys);

      console.log("data", res);
      setRestApiResponse(res);
      // setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
      // setProducts([]);
    }
  };

  const isValidGenerateChart = () => {
    if (typeof selectListItemOne !== "string") {
      alert("label should be string");
      return false;
    }

    if (typeof selectListItemTwo !== "number") {
      alert("value should be number");
      return false;
    }

    return true;
  };

  const handleGenerateChart = () => {
    // if (!isValidGenerateChart) return;

    console.log("restApiResponse", restApiResponse);

    const data = restApiResponse.reduce(
      (acc, item) => {
        const modifiedLabel = item[selectListItemOne]?.replace("&amp;", "");

        acc.labels.push(modifiedLabel);
        acc.values.push(item[selectListItemTwo]);

        return acc;
      },
      {
        labels: [],
        values: [],
      },
    );

    console.log("data", data);

    setDataValues(data);
  };

  const getPreviewValue = (data) => {
    const getType = (value) => {
      if (Array.isArray(value)) return "array";
      if (value === null) return "null";
      return typeof value;
    };

    const type = getType(data);

    switch (type) {
      case "string":
      case "number":
      case "boolean":
        return {
          type,
          data,
          label: String(data),
        };

      case "object":
        return {
          type: "object",
          data,
          label: "Object",
        };

      case "array":
        return {
          type: "array",
          data,
          label: `Array (${data.length})`,
        };

      case "null":
        return {
          type: "null",
          data: null,
          label: "Null",
        };

      default:
        return {
          type: "unknown",
          data,
          label: "Unknown",
        };
    }
  };

  const checkTypeOfData = (value, isLabel) => {
    // check label
    if (isLabel) return typeof value === "string";

    //  check value
    const cleaned = Number(String(value).replace("$", ""));

    return !isNaN(cleaned);
  };

  return (
    <div className="dashboard-root">
      {/* tittle */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
      </div>

      {/* api call input */}
      <section className="section-container">
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
          <input type="text" ref={inputSubmitUrl} placeholder="URL here..." />
        </div>
      </section>

      {/* select chart type */}
      <section className="section-container">
        <b className="step-name">step : 2</b>
        <h3>Select chart:</h3>
        <div
          style={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            gap: 5,
          }}
        >
          <div className="chart-selector">
            <select
              value={selectedChart}
              onChange={(e) => {
                setSelectedChart(e.target.value);
                setCheckboxSelected([]);
              }}
            >
              <option disabled>Select Option</option>
              {chartList.map((chart) => (
                <option key={chart.type} value={chart.type}>
                  {chart.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* generate data preview */}
      <section className="section-container">
        <b className="step-name">step : 3</b>

        <br />
        <br />
        <button disabled="" onClick={() => handleSubmitUrl()}>
          preview data
        </button>

        <h3>Select options:</h3>

        <div>
          {baseDataKeys.length > 0 && (
            <div className="radio-group-container">
              {/* select label */}
              <section>
                <h3>select label</h3>
                {baseDataKeys
                  .filter((name) => checkTypeOfData(singleData[name], true))
                  .map((name) => (
                    <div
                      key={name}
                      onClick={() => setSelectListItemOne(name)}
                      className="radio-list-item"
                    >
                      <input
                        type="radio"
                        checked={selectListItemOne === name}
                        readOnly
                      />
                      <span>{name}</span>
                      {/* <span>
                      {selectListItemOne === name && (
                        <PreviewValue name={name} data={singleData[name]} />
                      )}
                    </span> */}
                    </div>
                  ))}
              </section>

              {/* preview label */}
              <section>
                <h3>Preview label</h3>

                <div>
                  {apiAllData.map((row, index) => {
                    const preview = getPreviewValue(row[selectListItemOne]);
                    const value = preview.data;

                    return (
                      <div key={index}>
                        {["array", "object"].includes(preview.type) && (
                          <h5>{preview.label}</h5>
                        )}

                        {/* ARRAY TABLE */}
                        {preview.type === "array" &&
                          Array.isArray(value) &&
                          value.length > 0 && (
                            <table border="1">
                              <thead>
                                <tr>
                                  {Object.keys(value[0]).map((key) => (
                                    <th key={key}>{key}</th>
                                  ))}
                                </tr>
                              </thead>

                              <tbody>
                                {value.map((item, i) => (
                                  <tr key={i}>
                                    {Object.values(item).map((val, j) => (
                                      <td key={j}>{String(val)}</td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}

                        {/* OBJECT TABLE */}
                        {preview.type === "object" && (
                          <table border="1">
                            <tbody>
                              {Object.entries(value).map(([key, val]) => (
                                <tr key={key}>
                                  <td>{key}</td>
                                  <td>{String(val)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}

                        {/* SIMPLE VALUE */}
                        {["string", "number", "boolean"].includes(
                          preview.type,
                        ) && (
                          <>
                            {!(selectedChart === "cards") ? (
                              <p>{String(value)}</p>
                            ) : (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 5,
                                }}
                                onClick={() => onClickCheckbox(String(value))}
                              >
                                <input
                                  type="checkbox"
                                  readOnly
                                  checked={checkboxSelected.includes(
                                    String(value),
                                  )}
                                />
                                <span>{String(value)}</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* select value */}
              <section>
                <h3>select value</h3>
                {baseDataKeys
                  .filter((name) => checkTypeOfData(singleData[name], false))
                  .map((name) => (
                    <div
                      key={name}
                      onClick={() => setSelectListItemTwo(name)}
                      className="radio-list-item"
                    >
                      <input
                        type="radio"
                        checked={selectListItemTwo === name}
                        readOnly
                      />
                      <span>{name}</span>
                      {/* <span>
                      {selectListItemOne === name && (
                        <PreviewValue name={name} data={singleData[name]} />
                      )}
                    </span> */}
                    </div>
                  ))}
              </section>

              {/* preview label */}
              <section>
                <h3>Preview value</h3>

                <div>
                  {apiAllData.map((row, index) => {
                    const preview = getPreviewValue(row[selectListItemTwo]);
                    const value = preview.data;

                    return (
                      <div key={index}>
                        {["array", "object"].includes(preview.type) && (
                          <h5>{preview.label}</h5>
                        )}

                        {/* ARRAY TABLE */}
                        {preview.type === "array" &&
                          Array.isArray(value) &&
                          value.length > 0 && (
                            <table border="1">
                              <thead>
                                <tr>
                                  {Object.keys(value[0]).map((key) => (
                                    <th key={key}>{key}</th>
                                  ))}
                                </tr>
                              </thead>

                              <tbody>
                                {value.map((item, i) => (
                                  <tr key={i}>
                                    {Object.values(item).map((val, j) => (
                                      <td key={j}>{String(val)}</td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}

                        {/* OBJECT TABLE */}
                        {preview.type === "object" && (
                          <table border="1">
                            <tbody>
                              {Object.entries(value).map(([key, val]) => (
                                <tr key={key}>
                                  <td>{key}</td>
                                  <td>{String(val)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}

                        {/* SIMPLE VALUE */}
                        {["string", "number", "boolean"].includes(
                          preview.type,
                        ) && <p>{String(value)}</p>}
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          )}

          {baseDataKeys.length === 0 && <>no data to preview</>}
        </div>
      </section>

      {/* <br />

      <b> {selectListItemOne.join(", ")}</b>

      <br /> */}

      {/* <DeliveryCards /> */}

      {/* chart list */}
      <section className="section-container">
        <b className="step-name">step : 4</b>
        <br />
        <br />

        <div>
          <button onClick={() => handleGenerateChart()}>generate chart</button>
        </div>
        <br />

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
                data: pieData(),
                options: null,
              })
            }
          >
            <Pie data={pieData()} />
          </div>

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
                data: pieData(),
                options: null,
              })
            }
          >
            <Doughnut data={pieData()} />
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
          <div className="modal-chart-container">
            {renderChart(activeChart)}
          </div>
        </Modal>
      </section>
    </div>
  );
}

// const getType = (value) => {
//   if (Array.isArray(value)) return "array";
//   if (value === null) return "null";
//   return typeof value;
// };
