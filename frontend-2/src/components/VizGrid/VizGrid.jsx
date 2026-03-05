import React from "react";
import "./VizGrid.css";

export default function VizGrid({ visTypes, selected, onSelect }) {
  return (
    <div className="vizGrid">
      {visTypes.map((v) => (
        <button
          key={v.id}
          className={`vizCard ${selected === v.id ? "selected" : ""}`}
          onClick={() => onSelect(v.id)}
          type="button"
        >
          <div className="vizIcon">{v.icon}</div>
          <div className="vizMeta">
            <div className="vizTitle">{v.label}</div>
            <div className="vizDesc">{v.desc}</div>
          </div>
          <div className="vizCorner">↗</div>
        </button>
      ))}
    </div>
  );
}
