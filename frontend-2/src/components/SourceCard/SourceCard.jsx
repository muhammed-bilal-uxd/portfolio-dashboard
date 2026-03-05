import React from "react";
import "./SourceCard.css";

export default function SourceCard({
  source,
  active,
  checked,
  onClick,
  onToggle,
}) {
  return (
    <div className={`sourceCard ${active ? "active" : ""}`} onClick={onClick}>
      <div className="sourceText">
        <div className="sourceTitle">{source.title}</div>
        <div className="sourceSub">{source.sub}</div>
      </div>

      <label className="chk" onClick={(e) => e.stopPropagation()}>
        <input type="checkbox" checked={checked} onChange={onToggle} />
        <span />
      </label>
    </div>
  );
}
