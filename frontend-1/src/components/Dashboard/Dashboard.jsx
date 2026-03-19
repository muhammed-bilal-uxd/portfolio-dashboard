import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "../../pages/ThemeContext/ThemeContext";
import Modal from "../Modal/Modal";
import DeliveryCards from "../DeliveryCards/DeliveryCards";
import ChartModel from "../chart/Chart";

const VITE_API_URL = import.meta.env.VITE_API_URL;

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
  const { theme: themeArray } = useTheme();
  const theme = themeArray;

  // { type, title, data, options }
  const [products, setProducts] = useState([]);
  const [productsKeys, setProductsKeys] = useState([]);
  const [categories, setCategory] = useState([]);
  const [showCheckbox, setShowCheckbox] = useState(false);
  const [checkboxSelected, setCheckboxSelected] = useState([]);
  const [viewDataLabel, setViewDataLabel] = useState("");
  const [restApiResponse, setRestApiResponse] = useState([]);
  const [selectListItemOne, setSelectListItemOne] = useState("");
  const [selectListItemTwo, setSelectListItemTwo] = useState("");
  const [selectListItemOneIndex, setSelectListItemOneIndex] = useState(0);
  const [baseDataKeys, setBaseDataKeys] = useState([]);
  const [singleData, setSingleData] = useState({});
  const [apiAllData, setApiAllData] = useState([]);
  const [selectedChart, setSelectedChart] = useState("card");

  const inputSubmitUrl = useRef(null);
  const [newConfigName, setNewConfigName] = useState("");
  const [configList, setConfigList] = useState([]);

  useEffect(() => {
    if (!singleData || !baseDataKeys.length) return;

    const filterLabels = baseDataKeys.filter((name) =>
      checkTypeOfData(singleData[name], true),
    );

    const filterValues = baseDataKeys.filter((name) =>
      checkTypeOfData(singleData[name], false),
    );

    if (filterLabels[0]) {
      setSelectListItemOne(filterLabels[0]);
      setSelectListItemOneIndex(0);
      setViewDataLabel(singleData[filterLabels[0]]);
    }

    if (filterValues[0]) {
      setSelectListItemTwo(filterValues[0]);
    }
  }, [singleData, baseDataKeys]);

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
    if (selectListItemOne === "") {
      alert("label missing");
      return false;
    }

    if (selectListItemTwo === "") {
      alert("value missing");
      return false;
    }

    if (viewDataLabel === "") {
      alert("value data label missing");
      return false;
    }

    if (newConfigName === "") {
      alert(selectedChart + " name missing");
      return false;
    }

    return true;
  };

  const getChartData = () => {
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

    // setDataValues(data);
    return data;
  };

  const handleAddNewChart = () => {
    if (!isValidGenerateChart()) return;

    const viewDataValue = getPreviewValue(
      apiAllData[selectListItemOneIndex][selectListItemTwo],
    ).data;

    const newConfig = {
      inputSubmitUrl: inputSubmitUrl.current.value,
      selectedChart: selectedChart,
      selectListItemOne: selectListItemOne,
      selectListItemTwo: selectListItemTwo,
      viewDataLabel: viewDataLabel,
      viewDataValue: viewDataValue,
      newConfigName: newConfigName,
      dataValues: getChartData(),
    };

    setConfigList([...configList, newConfig]);
    // addChart();
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
                      onClick={() => {
                        setSelectListItemOne(name);
                      }}
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
                <h3>view data label</h3>

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
                            {!(selectedChart === "card") ? (
                              <p>{String(value)}</p>
                            ) : (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: 5,
                                }}
                                onClick={() => {
                                  setViewDataLabel(value);
                                  setSelectListItemOneIndex(index);
                                }}
                              >
                                <input
                                  type="radio"
                                  readOnly
                                  checked={value === viewDataLabel}
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
                <h3>value view data</h3>

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

      <section className="section-container">
        <b className="step-name">step : 4</b>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <h3>Enter your new {selectedChart} name:</h3>
          <input
            type="text"
            placeholder="Enter name"
            value={newConfigName}
            onChange={(e) => setNewConfigName(e.target.value)}
          />
        </div>
      </section>

      {/* chart list */}
      <section className="section-container">
        <b className="step-name">step : 5</b>
        <br />
        <br />

        <div>
          <button onClick={() => handleAddNewChart()}>
            add new{" "}
            {selectedChart === "card" ? "card" : `${selectedChart} chart`}
          </button>
        </div>
        <br />

        <div
          style={{
            display: "flex",
            // alignItems: "center",
            // justifyContent: "center",
            flexDirection: "column-reverse",
            gap: 50,
          }}
        >
          {configList.map((data, index) => (
            <ChartModel key={index} chartData={data}></ChartModel>
          ))}
        </div>
      </section>
    </div>
  );
}

// const getType = (value) => {
//   if (Array.isArray(value)) return "array";
//   if (value === null) return "null";
//   return typeof value;
// };
