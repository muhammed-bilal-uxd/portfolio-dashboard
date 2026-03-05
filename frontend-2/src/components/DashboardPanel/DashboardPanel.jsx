import React from "react";
import "./DashboardPanel.css";
import DashboardChartCard from "../DashboardChartCard/DashboardChartCard";
import EmptyDropZone from "../EmptyDropZone/EmptyDropZone";

export default function DashboardPanel({ selectedViz }) {
  return (
    <section className="panel">
      <div className="headerRow">
        <div className="panelTitle">Dashboard</div>
        <button className="btn primary" type="button">
          Share
        </button>
      </div>

      <div className="dashGrid">
        <DashboardChartCard
          title="Visitor Growth Spike Monthly"
          subtitle="PIE CHART"
          selectedViz={selectedViz}
        />
        <EmptyDropZone />
        <EmptyDropZone />
      </div>
    </section>
  );
}
