// dependencies
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

// context
import { useTheme } from "../../pages/ThemeContext/ThemeContext";

// components
import ChartModel from "../ChartModel/ChartModel";

// css
import "./Dashboard.css";
import Modal from "../Modal/Modal";

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

  const { id: projectId } = useParams();

  useEffect(() => {
    getAllSources();
  }, []);

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
      selectedInputSource: selectedInputSource,
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
      // alert(payload?.message || "source saved successfully");
      // setShowSourcePopup(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const getAllSources = async () => {
    if (!projectId) return alert("project id needed");

    const url = VITE_API_URL + "/project-source/" + projectId;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await response.json().catch(() => null);

    // if (!res.ok) {
    //   throw new Error(
    //     res?.message || `Request failed with status ${res.status}`,
    //   );
    // }

    console.log("res", res);

    setSourceList([...res]);
    setSelectedInputSource(res[0]);
  };

  const getSourceShortLink = (link) => {
    return link.split("?")[0];
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
      return alert("duplicate found");
    }

    setSourceLinkPopupConfig({
      isView: false,
      sourceLink: inputSource,
    });
    setShowSourcePopup(true);
  };

  // dev start
  return (
    <div className="dashboard-root">
      {/* tittle */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
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
          {/* <button onClick={() => setSourceList([...sourceList, inputSource])}>
            add
          </button> */}
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
                    {getSourceShortLink(source?.sourceLink)}
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
          <button onClick={() => handleNavNextSection(2)}>select chart</button>
        </div>
      </section>

      {/* select chart type */}
      <section className="section-container" id="section-container-2">
        <b className="step-name">step : 2</b>
        <h3>Select chart:</h3>
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
                setSelectedChart(e.target.value);
                setCheckboxSelected([]);
                setBaseDataKeys([]);
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
              if (selectedChart === "")
                return alert("please select chart type");
              handleNavNextSection(3);
              handleSubmitUrl();
            }}
          >
            map data
          </button>
          {/* <button onClick={()=> handleNavNextSection(3) }>next</button> */}
        </div>
      </section>

      {/* generate data preview */}
      <section className="section-container" id="section-container-3">
        <b className="step-name">step : 3</b>

        <h3>Map data:</h3>

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
                <h3>preview label data</h3>

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
                <h3>preview value data</h3>

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
        <div className="next-button-container">
          <button onClick={() => handleNavNextSection(4)}>
            Enter your new card name
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
          <h3>
            Enter your new{" "}
            {selectedChart === "card" ? "card" : selectedChart + " chart"} name:
          </h3>
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
              handleNavNextSection(5);
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
            flexDirection: "column-reverse",
            gap: 50,
          }}
        >
          {configList.map((data, index) => (
            <ChartModel key={index} chartData={data}></ChartModel>
          ))}
        </div>
      </section>
      <div className="next-button-container">
        <button onClick={() => handleNavNextSection(1)}>back to top</button>
      </div>
    </div>
  );
}

// const getType = (value) => {
//   if (Array.isArray(value)) return "array";
//   if (value === null) return "null";
//   return typeof value;
// };
