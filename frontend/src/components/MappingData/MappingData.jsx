import React, { useEffect, useState } from "react";
import { Button, Checkbox } from "@mui/material";
import "./MappingData.css";

import { checkTypeOfData } from "../../utils/common";
import CustomDropdown from "../CustomDropdown/CustomDropdown";

export default function MappingData({
  //input
  parent,
  showMappingData,
  mapBaseDataKeys,
  mapSelectListItemOne,
  mapSelectListItemTwo,
  mapApiAllData,
  mapSelectedChart,
  mapSingleData,
  mapTableItems,

  // output
  setMapSelectListItemOne,
  setMapSelectListItemTwo,
  setMapTableItems,
}) {
  const [showData, setShowData] = useState(false);
  const [isFilterLabel, setIsFilterLabel] = useState(true);
  const [isFilterValue, setIsFilterValue] = useState(true);
  

  useEffect(() => {
    if (!mapSingleData || !mapBaseDataKeys.length) return;

    const filterLabels = mapBaseDataKeys.filter((name) =>
      checkTypeOfData(mapSingleData[name], 'string'),
    );

    const filterValues = mapBaseDataKeys.filter((name) =>
      checkTypeOfData(mapSingleData[name], 'number'),
    );

    if (filterLabels[0]) {
      setMapSelectListItemOne(filterLabels[0]);
      setMapSelectListItemTwo(filterValues[0]);
      // setMapTableItems([0]);
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

    // Disabled restriction: Always allow multi-select regardless of mapSelectedChart
    const isExistItem = (mapTableItems || []).includes(index);

    if (!isExistItem) {
      updatedItems = [...(mapTableItems || []), index];
    } else {
      updatedItems = (mapTableItems || []).filter((j) => j !== index);
    }

    setMapTableItems(updatedItems);
  };

  const handleShowData = () => {
    setShowData(true);
    if (parent === "chart") {
      setMapTableItems(mapTableItems);
    }
    if (parent === "dashboard") {
      setMapTableItems([0]);
    }
  };

  // div start
  return (
    <div>
      {showMappingData && (
        <div>
          {Array.isArray(mapBaseDataKeys) && mapBaseDataKeys.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <section style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
                {/* select label */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <CustomDropdown
                    headerLabel="Select Type of Label"
                    value={mapSelectListItemOne}
                    onChange={(val) => {
                      setMapSelectListItemOne(val);
                      setShowData(false);
                    }}
                    options={mapBaseDataKeys.filter((name) => {
                      if (mapSingleData[name] === "") return false;
                      return !isFilterLabel || checkTypeOfData(mapSingleData[name], 'string');
                    })}
                    placeholder="Select Label"
                  />

                  <div className="cursor-pointer" onClick={() => setIsFilterLabel(!isFilterLabel)} style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                    <Checkbox
                      checked={isFilterLabel}
                      size="small"
                      sx={{ padding: "4px", color: "var(--color-outline-variant)", "&.Mui-checked": { color: "var(--color-tertiary)" } }}
                    />
                    <span style={{ fontSize: "0.875rem", color: "var(--color-on-surface-variant)" }}>Filter Label Properties</span>
                  </div>
                </div>

                {/* select value */}
                <div style={{ flex: 1 }}>
                  <CustomDropdown
                    headerLabel="Select Type of Value"
                    value={mapSelectListItemTwo}
                    onChange={(val) => {
                      setMapSelectListItemTwo(val);
                      setShowData(false);
                    }}
                    options={mapBaseDataKeys.filter((name) => {
                      if (mapSingleData[name] === "") return false;
                      return !isFilterValue || checkTypeOfData(mapSingleData[name], 'number');
                    })}
                    placeholder="Select Value"
                  />
                  <div className="cursor-pointer" onClick={() => setIsFilterValue(!isFilterValue)} style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                    <Checkbox
                      checked={isFilterValue}
                      size="small"
                      sx={{ padding: "4px", color: "var(--color-outline-variant)", "&.Mui-checked": { color: "var(--color-tertiary)" } }}
                    />
                    <span style={{ fontSize: "0.875rem", color: "var(--color-on-surface-variant)" }}>Filter Value Properties</span>
                  </div>
                </div>
              </section>

              <section style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  color="primary"
                  variant="outlined"
                  disabled={showData}
                  onClick={() => {
                    handleShowData();
                  }}
                  sx={{ width: "fit-content", borderRadius: '8px' }}
                >
                  Preview Data Mapping
                </Button>
              </section>

              {showData && (
                <section className="d-flex">
                  <h2 className="mapping-results-title">
                    {mapSelectedChart === "card"
                      ? "Select Label & Corresponding Value"
                      : "Select Labels & Corresponding Values"}
                  </h2>
                </section>
              )}

              {showData && (
                <section>
                  <div className="data-table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th style={{ width: "48px" }}>
                            <Checkbox
                              size="small"
                              indeterminate={
                                (mapTableItems || []).length > 0 &&
                                (mapTableItems || []).length < mapApiAllData.length
                              }
                              checked={
                                mapApiAllData.length > 0 &&
                                (mapTableItems || []).length === mapApiAllData.length
                              }
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setMapTableItems(mapApiAllData.map((_, i) => i));
                                } else {
                                  setMapTableItems([]);
                                }
                              }}
                              sx={{
                                padding: "4px",
                                color: "var(--color-outline-variant)",
                                "&.Mui-checked, &.MuiCheckbox-indeterminate": {
                                  color: "var(--color-tertiary)",
                                },
                              }}
                            />
                          </th>
                          <th style={{ minWidth: "150px" }}>Label - {mapApiAllData?.length || 0}</th>
                          <th style={{ minWidth: "150px" }}>Corresponding Values</th>
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
                                (mapTableItems || []).includes(index)
                                  ? "selected-map-item"
                                  : "selected-map-item-no"
                              }
                              onClick={() => handleTableSelectItem(index)}
                            >
                              {["string", "number", "boolean"].includes(
                                previewLabel.type,
                              ) && (
                                <>
                                  <td className="mapping-selection-cell">
                                    <Checkbox
                                      size="small"
                                      checked={(mapTableItems || []).includes(index)}
                                      sx={{ padding: "4px", color: "var(--color-outline-variant)", "&.Mui-checked": { color: "var(--color-tertiary)" } }}
                                    />
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
    </div>
  );
}
