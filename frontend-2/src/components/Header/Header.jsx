import React from "react";
import "./Header.css";

export default function Header({ query, setQuery }) {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="logoMark">↩</div>
        <div className="tab">Data</div>
        <div className="date">16 Feb 2026</div>
      </div>

      <div className="topSearch">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
        />
        <button className="iconBtn" type="button" title="Search">
          🔍
        </button>
      </div>

      <div className="topRight">
        <div className="pill">🇺🇸 English ▾</div>
        <button className="iconBtn" type="button" title="Notifications">
          🔔
        </button>
        <div className="avatar" title="Profile" />
      </div>
    </header>
  );
}
