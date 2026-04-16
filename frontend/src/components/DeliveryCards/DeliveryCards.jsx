import React from "react";
import { Button } from "@mui/material";
import "./DeliveryCards.css";

const DeliveryCards = () => {
  const cards = [
    {
      title: "Nearest delivery",
      date: "26.12.23",
      label: "Responsible for delivery",
      icon: "📦",
      people: [
        { name: "Arjun", img: "https://i.pravatar.cc/80?img=12" },
        { name: "Meera", img: "https://i.pravatar.cc/80?img=32" },
      ],
    },
    {
      title: "Next pickup",
      date: "28.12.23",
      label: "Pickup team",
      icon: "🛻",
      people: [
        { name: "Kiran", img: "https://i.pravatar.cc/80?img=22" },
        { name: "Sana", img: "https://i.pravatar.cc/80?img=45" },
      ],
    },
    {
      title: "Scheduled delivery",
      date: "02.01.24",
      label: "Assigned crew",
      icon: "🗓️",
      people: [
        { name: "Vikram", img: "https://i.pravatar.cc/80?img=15" },
        { name: "Anu", img: "https://i.pravatar.cc/80?img=48" },
      ],
    },
    {
      title: "Express slot",
      date: "Today, 7:30 PM",
      label: "On-call support",
      icon: "⚡",
      people: [
        { name: "Rahul", img: "https://i.pravatar.cc/80?img=8" },
        { name: "Nisha", img: "https://i.pravatar.cc/80?img=36" },
      ],
    },
  ];

  return (
    <div className="delivery-wrap">
      {cards.map((c) => (
        <div key={c.title} className="delivery-card">
          <div className="delivery-top-row">
            <div className="delivery-icon">{c.icon}</div>

            <div className="delivery-title-col">
              <div className="delivery-title">{c.title}</div>
            </div>
          </div>

          <div className="delivery-top-row">
            <div className="delivery-date">{c.date}</div>
          </div>

          <div className="delivery-bottom-row">
            <div className="delivery-label">{c.label}</div>

            <div className="delivery-people">
              {c.people.map((p, i) => (
                <img
                  key={p.name}
                  src={p.img}
                  alt={p.name}
                  title={p.name}
                  className={`delivery-avatar ${
                    i === 0 ? "delivery-avatar--overlap" : ""
                  }`}
                />
              ))}

              <Button
                aria-label="More"
                className="delivery-more-btn"
                color="primary"
                variant="contained"
                onClick={() => console.log("more", c.title)}
                type="button"
              >
                <span className="delivery-more-dot" />
                <span className="delivery-more-dot" />
                <span className="delivery-more-dot" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DeliveryCards;

