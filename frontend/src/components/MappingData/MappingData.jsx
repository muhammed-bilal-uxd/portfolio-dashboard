import React, { useEffect, useState } from "react";
import { Button, Checkbox, Box, Stack, Typography } from "@mui/material";
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
            <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, sm: 3 } }}>
              <Stack 
                direction={{ xs: "column", sm: "row" }} 
                spacing={{ xs: 2, sm: 3 }} 
                alignItems="flex-start"
              >
                {/* select label */}
                <Box sx={{ flex: 1, width: "100%", minWidth: 0 }}>
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

                  <Box 
                    className="cursor-pointer" 
                    onClick={() => setIsFilterLabel(!isFilterLabel)} 
                    sx={{ display: 'flex', alignItems: 'center', mt: 1 }}
                  >
                    <Checkbox
                      checked={isFilterLabel}
                      size="small"
                      sx={{ p: 0.5, color: "var(--color-outline-variant)", "&.Mui-checked": { color: "var(--color-tertiary)" } }}
                    />
                    <Typography sx={{ fontSize: "0.8125rem", color: "var(--color-on-surface-variant)", fontWeight: 500 }}>
                      Filter Label Properties
                    </Typography>
                  </Box>
                </Box>

                {/* select value */}
                <Box sx={{ flex: 1, width: "100%" }}>
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
                  <Box 
                    className="cursor-pointer" 
                    onClick={() => setIsFilterValue(!isFilterValue)} 
                    sx={{ display: 'flex', alignItems: 'center', mt: 1 }}
                  >
                    <Checkbox
                      checked={isFilterValue}
                      size="small"
                      sx={{ p: 0.5, color: "var(--color-outline-variant)", "&.Mui-checked": { color: "var(--color-tertiary)" } }}
                    />
                    <Typography sx={{ fontSize: "0.8125rem", color: "var(--color-on-surface-variant)", fontWeight: 500 }}>
                      Filter Value Properties
                    </Typography>
                  </Box>
                </Box>
              </Stack>

              <Box sx={{ display: "flex", justifyContent: { xs: "center", sm: "flex-end" } }}>
                <Button
                  variant="outlined"
                  disabled={showData}
                  onClick={() => {
                    handleShowData();
                  }}
                  className="btn-pill-primary"
                  sx={{ 
                    width: { xs: "100%", sm: "fit-content" },
                    borderRadius: '24px',
                    borderColor: "var(--color-tertiary)",
                    color: "var(--color-tertiary)",
                    textTransform: "none",
                    fontWeight: 700,
                    px: 4,
                    "&:hover": {
                      borderColor: "var(--color-tertiary)",
                      bgcolor: "rgba(103, 156, 255, 0.05)"
                    }
                  }}
                >
                  Preview Data Mapping
                </Button>
              </Box>

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
            </Box>
          )}
          {Array.isArray(mapBaseDataKeys) && mapBaseDataKeys.length === 0 && (
            <>no data to preview</>
          )}
        </div>
      )}
    </div>
  );
}
