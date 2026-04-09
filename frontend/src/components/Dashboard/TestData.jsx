import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function TestData() {
  const sampleData = [
    {
      id: 1,
      product: {
        name: "Apple",
        category: {
          title: "Fruits",
        },
      },
      sales: {
        total: 120,
        price: 30,
      },
      location: {
        city: "Chennai",
      },
    },
    {
      id: 2,
      product: {
        name: "Banana",
        category: {
          title: "Fruits",
        },
      },
      sales: {
        total: 200,
        price: 20,
      },
      location: {
        city: "Bangalore",
      },
    },
    {
      id: 3,
      product: {
        name: "Orange",
        category: {
          title: "Fruits",
        },
      },
      sales: {
        total: 150,
        price: 25,
      },
      location: {
        city: "Hyderabad",
      },
    },
  ];

  const [labelPath, setLabelPath] = useState("product.name");
  const [valuePath, setValuePath] = useState("sales.total");

  function getObjectPaths(obj, prefix = "") {
    let paths = [];

    for (const key in obj) {
      const newPath = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];

      if (value !== null && typeof value === "object" && !Array.isArray(value)) {
        paths = [...paths, ...getObjectPaths(value, newPath)];
      } else if (!Array.isArray(value)) {
        paths.push(newPath);
      }
    }

    return paths;
  }

  function getValueByPath(obj, path) {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
  }

  function buildChartData(data, selectedLabelPath, selectedValuePath) {
    return data
      .map((item) => {
        const label = getValueByPath(item, selectedLabelPath);
        const value = getValueByPath(item, selectedValuePath);

        return {
          label: label ?? "",
          value: Number(value) || 0,
        };
      })
      .filter((item) => item.label !== "");
  }

  const allPaths = useMemo(() => {
    if (!sampleData.length) return [];
    return getObjectPaths(sampleData[0]);
  }, []);

  const chartData = useMemo(() => {
    if (!labelPath || !valuePath) return [];
    return buildChartData(sampleData, labelPath, valuePath);
  }, [labelPath, valuePath]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f7f9",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: "8px" }}>Chart Path Selector</h1>
        <p style={{ marginTop: 0, color: "#666", marginBottom: "24px" }}>
          Select nested object paths for chart label and value.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              Label Path
            </label>
            <select
              value={labelPath}
              onChange={(e) => setLabelPath(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                fontSize: "14px",
              }}
            >
              {allPaths.map((path) => (
                <option key={path} value={path}>
                  {path}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              Value Path
            </label>
            <select
              value={valuePath}
              onChange={(e) => setValuePath(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                fontSize: "14px",
              }}
            >
              {allPaths.map((path) => (
                <option key={path} value={path}>
                  {path}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div
          style={{
            height: "360px",
            background: "#fafafa",
            border: "1px solid #eee",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "24px",
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <div
            style={{
              background: "#fafafa",
              border: "1px solid #eee",
              borderRadius: "12px",
              padding: "16px",
              overflow: "auto",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Available Paths</h3>
            <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
              {JSON.stringify(allPaths, null, 2)}
            </pre>
          </div>

          <div
            style={{
              background: "#fafafa",
              border: "1px solid #eee",
              borderRadius: "12px",
              padding: "16px",
              overflow: "auto",
            }}
          >
            <h3 style={{ marginTop: 0 }}>Chart Data</h3>
            <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
              {JSON.stringify(chartData, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}