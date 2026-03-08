import React from "react";
import "./PublishSection.css";

export default function PublishSection({ games = [] }) {
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
      <div className="publish-games-section">
        <h3 className="publish-games-title">SerpAPI Games</h3>
        {games && games.length > 0 ? (
          <ul className="publish-games-list">
            {games.slice(0, 5).map((game, index) => (
              <li key={game.position || game.product_id || index} className="publish-game-item">
                <div className="publish-game-main">
                  <span className="publish-game-title">
                    {game.title || game.app_name || "Untitled game"}
                  </span>
                  {typeof game.rating === "number" && (
                    <span className="publish-game-rating">{game.rating.toFixed(1)} ★</span>
                  )}
                </div>
                {game.developer && (
                  <div className="publish-game-meta">
                    <span className="publish-game-developer">{game.developer}</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="publish-games-empty">No games loaded yet.</p>
        )}
      </div>
    </div>
  );
}

