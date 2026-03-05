import React from "react";
import "./SourcesPanel.css";
import SourceCard from "../SourceCard/SourceCard";

export default function SourcesPanel({
  sources,
  query,
  setQuery,
  selectedSourceId,
  onSelectSource,
  checked,
  onToggleChecked,
}) {
  return (
    <aside className="panel">
      <div className="panelTitleRow">
        <div className="panelTitle">All Sources</div>
        <div className="pill">{sources.length}</div>
      </div>

      <button className="btn ghost full" type="button">
        <span className="plus">+</span> Add sources
      </button>

      <div className="searchBox">
        <div className="searchIcon">🔎</div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the web for new sources"
        />
        <button className="iconBtn" type="button" title="Search">
          ➜
        </button>
      </div>

      <div className="sourceList">
        {sources.map((s) => (
          <SourceCard
            key={s.id}
            source={s}
            active={s.id === selectedSourceId}
            checked={checked.has(s.id)}
            onClick={() => onSelectSource(s.id)}
            onToggle={() => onToggleChecked(s.id)}
          />
        ))}
      </div>
    </aside>
  );
}
