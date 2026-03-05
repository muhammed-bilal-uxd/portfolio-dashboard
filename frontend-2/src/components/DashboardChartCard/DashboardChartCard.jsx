import React from "react";
import "./DashboardChartCard.css";

export default function DashboardChartCard({ title, subtitle, selectedViz }) {
  return (
    <div className="card dashCard">
      <div className="dashCardHead">
        <div>
          <div className="dashTitle">{title}</div>
          <div className="tiny muted">{subtitle}</div>
        </div>
        <button className="iconBtn" type="button" title="Open">
          ↗
        </button>
      </div>

      <div className="mockChart">
        <div className="mockLegend">
          <span className="legendDot a" /> Desktop
          <span className="legendDot b" /> Mobile
          <span className="legendDot c" /> Tablet
        </div>

        <div className="mockPieWrap">
          <div className={`mockPie ${selectedViz}`} />
        </div>
      </div>
    </div>
  );
}
