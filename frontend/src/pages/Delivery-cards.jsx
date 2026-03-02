import React from "react";

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
    <div style={styles.wrap}>
      {cards.map((c, idx) => (
        <div key={idx} style={styles.card}>
          <div style={styles.topRow}>
            <div style={styles.icon}>{c.icon}</div>

            <div style={{ flex: 1 }}>
              <div style={styles.title}>{c.title}</div>
              {/* <div style={styles.date}>{c.date}</div> */}
            </div>
          </div>

          <div style={styles.topRow}>
            <div style={styles.date}>{c.date}</div>
          </div>

          <div style={styles.bottomRow}>
            <div style={styles.label}>{c.label}</div>

            <div style={styles.people}>
              {c.people.map((p, i) => (
                <img
                  key={p.name}
                  src={p.img}
                  alt={p.name}
                  title={p.name}
                  style={{
                    ...styles.avatar,
                    marginRight: i === 0 ? -10 : 0,
                    zIndex: 2 - i,
                  }}
                />
              ))}

              <button
                aria-label="More"
                style={styles.moreBtn}
                onClick={() => console.log("more", c.title)}
              >
                <span style={styles.moreDot} />
                <span style={styles.moreDot} />
                <span style={styles.moreDot} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  wrap: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 16,
    padding: 16,
    background: "transparent",
  },
  card: {
    borderRadius: 18,
    padding: 18,
    color: "#EAF0FF",
    background:
      "linear-gradient(135deg, rgba(92,106,168,0.95), rgba(64,74,125,0.95))",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
    border: "1px solid rgba(255,255,255,0.08)",
    minHeight: 120,
    display: "flex",
    flexDirection: "column",
  },
  topRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  icon: {
    width: 34,
    height: 34,
    borderRadius: 25,
    display: "grid",
    placeItems: "center",
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.10)",
    fontSize: 16,
    flex: "0 0 auto",
  },
  title: {
    fontSize: 14,
    opacity: 0.85,
    fontWeight: 600,
    letterSpacing: 0.2,
    textAlign: "left",
  },
  date: {
    marginTop: 6,
    fontSize: 26,
    letterSpacing: 0.3,
    lineHeight: 1.05,
    textAlign: "left",
  },
  moreBtn: {
    width: 30,
    height: 30,
    borderRadius: 25,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.10)",
    display: "grid",
    placeItems: "center",
    gridAutoFlow: "column",
    cursor: "pointer",
    marginLeft: -10,
    padding: 0,
    zIndex: 0,
  },
  moreDot: {
    width: 3,
    height: 3,
    borderRadius: 999,
    background: "rgba(255,255,255,0.85)",
    display: "block",
    margin: 0,
  },
  bottomRow: {
    marginTop: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  label: {
    fontSize: 12,
    opacity: 0.75,
    fontWeight: 600,
  },
  people: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: "50%",
    objectFit: "cover",
    // border: "1px solid rgba(30,38,74,0.85)",
    // boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
    background: "rgba(255,255,255,0.1)",
  },
};

export default DeliveryCards;
