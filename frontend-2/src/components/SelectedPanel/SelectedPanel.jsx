import React from "react";
import "./SelectedPanel.css";
import VizGrid from "../VizGrid/VizGrid";

export default function SelectedPanel({
  selectedSource,
  selectedCount,
  jsonPayload,
  visTypes,
  selectedViz,
  onSelectViz,
}) {
  return (
    <section className="panel">
      <div className="headerRow">
        <div className="panelTitleRow">
          <div className="panelTitle">Selected Sources</div>
          <div className="pill">{selectedCount}</div>
        </div>
        <button className="btn primary small" type="button">
          Preview
        </button>
      </div>

      <div className="card big">
        <div className="cardHead">
          <div>
            <div className="h2">{selectedSource.title}</div>
            <div className="tiny muted">DESCRIPTION</div>
          </div>
          <button className="iconBtn" type="button" title="Open">
            ↗
          </button>
        </div>

        <ul className="bullets">
          <li>Visitor growth: +18%</li>
          <li>Average daily visitors: 12.4K</li>
          <li>Peak day: Feb 18, 2026</li>
          <li>Change compared to last period: +6%</li>
        </ul>

        <button className="btn ghost small linky" type="button">
          ▸ View full details
        </button>

        <div className="divider" />

        <div className="rowBetween">
          <div className="tiny muted">SOURCE DATA</div>
          <button className="iconBtn" type="button" title="Copy JSON">
            ⧉
          </button>
        </div>

        <pre className="codeBlock">
          {`{
  "METRIC": "${jsonPayload.METRIC}",
  "VALUE": "${jsonPayload.VALUE}",
  "LOCATION": "${jsonPayload.LOCATION}",
  "PERIOD": "${jsonPayload.PERIOD}",
  "TREND": "${jsonPayload.TREND}"
}`}
        </pre>

        <div className="divider" />

        <div className="rowBetween">
          <div className="tiny muted">SELECTED VIEW</div>
          <div className="tiny muted">○ Tap to view in dashboard</div>
        </div>

        <VizGrid
          visTypes={visTypes}
          selected={selectedViz}
          onSelect={onSelectViz}
        />

        <button className="btn ghost full small" type="button">
          ▸ View all visualization
        </button>
      </div>
    </section>
  );
}
