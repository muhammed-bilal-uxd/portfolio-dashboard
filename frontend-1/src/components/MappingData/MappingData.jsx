import React, { useEffect, useState } from "react";
import "./MappingData.css";

const MappingData = ({
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
}) => {
  const [showData, setShowData] = useState(false);
  const [tableItems, setTableItems] = useState([]);

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
      setTableItems(0);
    }

    if (filterValues[0]) {
      setMapSelectListItemTwo(filterValues[0]);
    }
  }, [mapSingleData, mapBaseDataKeys]);

  const checkTypeOfData = (value, isLabel) => {
    // check label
    if (isLabel) return typeof value === "string";

    //  check value
    const cleaned = Number(String(value).replace("$", ""));

    return !isNaN(cleaned);
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

  const handleTableSelectItem = (index) => {
    if (mapSelectedChart === "card") {
      // [index] : [...tableItems,index]
      setTableItems([index]);
    } else {
      const isExistItem = (tableItems || []).includes(index);

      if (!isExistItem) {
        setTableItems([...(tableItems || []), index]);
      } else {
        setTableItems([...(tableItems || []).filter((j) => j !== index)]);
      }
    }
  };

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
                <button disabled={showData} onClick={() => setShowData(true)}>
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

              {/* {showData && (
              <section className="next-button-container">
                <button onClick={() => handleNavNextSection(4)}>
                  Enter your new card name
                </button>
              </section>
            )} */}
            </div>
          )}
          {Array.isArray(mapBaseDataKeys) && mapBaseDataKeys.length === 0 && (
            <>no data to preview</>
          )}
        </div>
      )}
    </>
  );
};

export default MappingData;
