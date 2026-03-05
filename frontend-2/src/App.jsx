import React, { useMemo, useState } from "react";
import "./App.css";

import Header from "./components/Header/Header";
import SourcesPanel from "./components/SourcesPanel/SourcesPanel";
import SelectedPanel from "./components/SelectedPanel/SelectedPanel";
import DashboardPanel from "./components/DashboardPanel/DashboardPanel";

const SOURCES = [
  {
    id: "yearly",
    title: "Visitor Growth Spike Yearly",
    sub: "Visitor growth: +18%",
  },
  {
    id: "monthly",
    title: "Visitor Growth Spike Monthly",
    sub: "Visitor growth: +18%",
  },
  {
    id: "weekly",
    title: "Visitor Growth Spike Weekly",
    sub: "Visitor growth: +18%",
  },
];

const VIS_TYPES = [
  {
    id: "line",
    label: "Line Chart",
    desc: "Shows trends over time.",
    icon: "📈",
  },
  {
    id: "pie",
    label: "Pie Chart",
    desc: "Shows parts of a whole.",
    icon: "🥧",
  },
  { id: "bar", label: "Bar Chart", desc: "Compares values.", icon: "📊" },
  {
    id: "scatter",
    label: "Scatter Plot",
    desc: "Shows variable correlation.",
    icon: "🟣",
  },
  {
    id: "hist",
    label: "Histogram",
    desc: "Shows data distribution.",
    icon: "🧱",
  },
  { id: "funnel", label: "Funnel", desc: "Shows stage drop-offs.", icon: "🔻" },
  { id: "donut", label: "Donut Chart", desc: "Shows percentages.", icon: "🍩" },
  {
    id: "radar",
    label: "Radar Chart",
    desc: "Compares multiple values.",
    icon: "🕸️",
  },
];

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedSourceId, setSelectedSourceId] = useState("monthly");
  const [checked, setChecked] = useState(
    () => new Set(["yearly", "monthly", "weekly"]),
  );
  const [selectedViz, setSelectedViz] = useState("pie");

  const selectedSource = useMemo(
    () => SOURCES.find((s) => s.id === selectedSourceId) || SOURCES[0],
    [selectedSourceId],
  );

  const filteredSources = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SOURCES;
    return SOURCES.filter(
      (s) =>
        s.title.toLowerCase().includes(q) || s.sub.toLowerCase().includes(q),
    );
  }, [query]);

  const jsonPayload = useMemo(
    () => ({
      METRIC: "VISITOR_GROWTH",
      VALUE: "+18%",
      LOCATION: "CHENNAI",
      PERIOD: "JAN-MAR 2026",
      TREND: "UPWARD",
    }),
    [],
  );

  const toggleChecked = (id) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="appShell">
      <Header query={query} setQuery={setQuery} />

      <main className="layout3">
        <SourcesPanel
          sources={filteredSources}
          query={query}
          setQuery={setQuery}
          selectedSourceId={selectedSourceId}
          onSelectSource={setSelectedSourceId}
          checked={checked}
          onToggleChecked={toggleChecked}
        />

        <SelectedPanel
          selectedSource={selectedSource}
          selectedCount={checked.size}
          jsonPayload={jsonPayload}
          visTypes={VIS_TYPES}
          selectedViz={selectedViz}
          onSelectViz={setSelectedViz}
        />

        <DashboardPanel selectedViz={selectedViz} />
      </main>
    </div>
  );
}
