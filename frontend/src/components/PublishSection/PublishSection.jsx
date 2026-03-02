import React from "react";
import "./PublishSection.css";

export default function PublishSection() {
  const handlePublish = () => {
    // Placeholder publish handler
    alert("Content Published!");
  };

  return (
    <div className="publish-container">
      {/* Title Section */}
      <div className="publish-header-section">
        <button className="publish-button" onClick={handlePublish}>
          publish
        </button>
      </div>
    </div>
  );
}

