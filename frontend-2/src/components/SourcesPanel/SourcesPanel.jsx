import React, { useState } from "react";
import "./SourcesPanel.css";
import SourceCard from "../SourceCard/SourceCard";

const STORAGE_KEY = "dashboardSources";

export default function SourcesPanel({
  sources,
  query,
  setQuery,
  selectedSourceId,
  onSelectSource,
  checked,
  onToggleChecked,
}) {
  const [showPopup, setShowPopup] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [consumerKey, setConsumerKey] = useState("");
  const [consumerSecret, setConsumerSecret] = useState("");

  const handleOpenPopup = () => setShowPopup(true);
  const handleClosePopup = () => {
    setShowPopup(false);
    setWebsiteUrl("");
    setConsumerKey("");
    setConsumerSecret("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const entry = { websiteUrl, consumerKey, consumerSecret };
    const existing = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "[]");
    existing.push(entry);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    handleClosePopup();
  };

  return (
    <aside className="panel">
      <div className="panelTitleRow">
        <div className="panelTitle">All Sources</div>
        <div className="pill">{sources.length}</div>
      </div>

      <button
        className="btn ghost full"
        type="button"
        onClick={handleOpenPopup}
      >
        <span className="plus">+</span> Add sources
      </button>

      {showPopup && (
        <div className="popupOverlay">
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <div className="popupHeader">
              <h3>Add source</h3>
              {/* <button
                type="button"
                className="popupClose"
                onClick={handleClosePopup}
                aria-label="Close"
              >
                ×
              </button> */}
            </div>
            <form onSubmit={handleSubmit} className="popupForm">
              <label>
                Website URL
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://example.com"
                  required
                />
              </label>
              <label>
                Consumer key
                <input
                  type="text"
                  value={consumerKey}
                  onChange={(e) => setConsumerKey(e.target.value)}
                  placeholder="Consumer key"
                  required
                />
              </label>
              <label>
                Consumer secret
                <input
                  type="text"
                  value={consumerSecret}
                  onChange={(e) => setConsumerSecret(e.target.value)}
                  placeholder="Consumer secret"
                  required
                />
              </label>
              <div className="popupActions">
                <button
                  type="button"
                  className="btn ghost"
                  onClick={handleClosePopup}
                >
                  Cancel
                </button>
                <button type="submit" className="btn">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
