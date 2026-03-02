import React from "react";

export default function PublishSection() {
  const handlePublish = () => {
    if (!title.trim()) {
      alert("Please enter a title before publishing.");
      return;
    }

    console.log("Published Title:", title);
    alert("Content Published!");
  };

  return (
    <div className="publish-container" style={styles.container}>
      {/* Title Section */}
      <div style={styles.headerSection}>
        <button style={styles.publishButton} onClick={handlePublish}>
          publish
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "100%",
    margin: "0 auto",
    padding: "4px",
    borderRadius: "12px",
    fontFamily: "Arial, sans-serif",
  },
  headerSection: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  publishButton: {
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "0.4em 0.6em",
    cursor: "pointer",
    fontSize: "14px",
    textTransform: "capitalize",
  },
};
