import React from "react";

const legendItems = [
  { color: "blue", label: "> 5000" },
  { color: "lightblue", label: "1001 - 5000" },
  { color: "lightsteelblue", label: "501 - 1000" },
  { color: "skyblue", label: "<= 500" },
];

const Legend = () => (
  <div className="legend">
    {legendItems.map((item, index) => (
      <div key={index} className="legend-item">
        <span className="legend-color" style={{ backgroundColor: item.color }} />
        <span className="legend-label">{item.label}</span>
      </div>
    ))}
  </div>
);

export default Legend;
