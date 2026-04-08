import React, { useEffect, useState } from "react";
import "./MappingData.css";

export default function MappingData({
  //input
  mapIsLoading,
  mapBaseDataKeys,
  mapSelectListItemOne,
  mapSelectListItemTwo,
  mapApiAllData,
  mapSelectedChart,
  mapSingleData,

  // output
  setMapSelectListItemOne,
  setMapSelectListItemTwo,
  setMapTableItems,
}) {
  const [showData, setShowData] = useState(false);
  const [tableItems, setTableItems] = useState([]);

  const checkTypeOfData = (value, isLabel) => {
    // check label
    if (isLabel) return typeof value === "string";

    //  check value
    const cleaned = Number(String(value).replace("$", ""));

    return !isNaN(cleaned);
  };

  useEffect(() => {
    if (!mapSingleData || !mapBaseDataKeys.length) return;

    const filterLabels = mapBaseDataKeys.filter((name) =>
      checkTypeOfData(mapSingleData[name], true),
    );

    const filterValues = mapBaseDataKeys.filter((name) =>
      checkTypeOfData(mapSingleData[name], false),
    );

    if (filterLabels[0]) {
      setMapSelectListItemOne(filterLabels[0]);
      // setTableItems([0]);
      // setMapTableItems([0]);
    }

    if (filterValues[0]) {
      setMapSelectListItemTwo(filterValues[0]);
    }
  }, [mapSingleData, mapBaseDataKeys]);

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

  const handleTableSelectItem = (index) => {
    let updatedItems;

    if (mapSelectedChart === "card") {
      updatedItems = [index];
    } else {
      const isExistItem = (tableItems || []).includes(index);

      if (!isExistItem) {
        updatedItems = [...(tableItems || []), index];
      } else {
        updatedItems = (tableItems || []).filter((j) => j !== index);
      }
    }

    setTableItems(updatedItems);
    setMapTableItems(updatedItems);
  };

  const handleShowData = () => {
    setShowData(true);
    setTableItems([0]);
    setMapTableItems([0]);
  };

  // div start
  return (
    <>
      <h3>Map data:</h3>

      {JSON.stringify(mapIsLoading)}

      {!mapIsLoading && (
        <div>
          {Array.isArray(mapBaseDataKeys) && mapBaseDataKeys.length > 0 && (
            <div className="d-flex f-col gap-15">
              <section className="d-flex gap-10 align-center map-dropdown-section">
                {/* select label */}
                <div className="flex-1">
                  <h3>select type of label</h3>

                  <select
                    value={mapSelectListItemOne}
                    onChange={(e) => {
                      setMapSelectListItemOne(e.target.value);
                      setShowData(false);
                    }}
                  >
                    {mapBaseDataKeys
                      .filter((name) =>
                        checkTypeOfData(mapSingleData[name], true),
                      )
                      .map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <span className="arrow-right">{"--->"}</span>
                </div>
                {/* select value */}
                <div className="flex-1">
                  <h3>select type of value</h3>
                  <select
                    style={{ maxWidth: "100%" }}
                    value={mapSelectListItemTwo}
                    onChange={(e) => {
                      setMapSelectListItemTwo(e.target.value);
                      setShowData(false);
                    }}
                  >
                    {mapBaseDataKeys
                      .filter((name) =>
                        checkTypeOfData(mapSingleData[name], false),
                      )
                      .map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                  </select>
                </div>
              </section>

              <section className="d-flex justify-end">
                <button
                  disabled={showData}
                  onClick={() => {
                    handleShowData();
                  }}
                >
                  show data
                </button>
              </section>

              {showData && (
                <section className="d-flex">
                  <h2 style={{ margin: 0 }}>
                    {mapSelectedChart === "card"
                      ? "Select Label & corresponding value"
                      : "Select Labels & corresponding values"}
                  </h2>
                </section>
              )}

              {showData && (
                <section>
                  <div className="data-table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th></th>
                          <th>Label - {mapApiAllData?.length || 0}</th>
                          <th>Corresponding values</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mapApiAllData.map((row, index) => {
                          const previewLabel = getPreviewValue(
                            row[mapSelectListItemOne],
                          );
                          const previewValue = getPreviewValue(
                            row[mapSelectListItemTwo],
                          );

                          return (
                            <tr
                              key={index}
                              // className="selected-map-item"
                              className={
                                (tableItems || []).includes(index)
                                  ? "selected-map-item"
                                  : "selected-map-item-no"
                              }
                              onClick={() => handleTableSelectItem(index)}
                            >
                              {["string", "number", "boolean"].includes(
                                previewLabel.type,
                              ) && (
                                <>
                                  <td
                                    style={{
                                      display: "flex",
                                      alignItems: "flex-start",
                                      gap: 5,
                                    }}
                                  >
                                    {mapSelectedChart === "card" && (
                                      <input
                                        type="radio"
                                        readOnly
                                        checked={(tableItems || []).includes(
                                          index,
                                        )}
                                      />
                                    )}
                                    {mapSelectedChart !== "card" && (
                                      <input
                                        type="checkbox"
                                        readOnly
                                        checked={(tableItems || []).includes(
                                          index,
                                        )}
                                      />
                                    )}
                                  </td>
                                  <td>{String(previewLabel?.data)}</td>
                                  <td>{String(previewValue?.data)}</td>
                                </>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}
            </div>
          )}
          {Array.isArray(mapBaseDataKeys) && mapBaseDataKeys.length === 0 && (
            <>no data to preview</>
          )}
        </div>
      )}
    </>
  );
}
