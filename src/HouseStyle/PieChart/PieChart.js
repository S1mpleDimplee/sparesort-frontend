import React, { useState } from "react";
import "./PieChart.css";

const PieChart = ({ items = [], size = 200, isPercentage = false, legendpos = "top" }) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  if (!items || items.length === 0) {
    items = [{ label: "Geen beschikbare data", amount: 102, color: "#e0e0e0" }];
  }

  // Calculate total ammount by summing up all item amounts
  const total = items.reduce((sum, item) => sum + (item.amount || 0), 0);

  // Calculate start and end angles for each slice for the pie chart
  let currentAngle = 0;
  const slices = items.map((item) => {
    const percentage = total > 0 ? (item.amount / total) * 100 : 0;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;

    return {
      ...item,
      percentage: percentage.toFixed(1),
      startAngle,
      endAngle: currentAngle,
    };
  });

  const calculateAngle = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  
  // Create SVG arc path for each slice
  const createArc = (startAngle, endAngle) => {
    const center = 50;
    const radius = 50;

    if (endAngle - startAngle === 360) {
      endAngle -= 0.01; // Full cirle is not supported, so make it slightly less then 3600 degrees
    }

    const start = calculateAngle(center, center, radius, endAngle);
    const end = calculateAngle(center, center, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      `M ${center} ${center}`,
      `L ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
      "Z",
    ].join(" ");
  };

  return (
    <div className="piechart-wrapper">
      {legendpos === "top" && (
        <div className="piechart-legend">
          {items.map((item, index) => (
            <div
              key={index}
              className="piechart-legend-item"
            >
              <span className="piechart-legend-box" style={{ backgroundColor: item.color }}></span>
              <span className="piechart-legend-text">{item.label}</span>
            </div>
          ))}
        </div>
      )}

      <div className="piechart-container">
        <svg width={size} height={size} viewBox="0 0 100 100" className="piechart-svg">
          {slices.map((slice, index) => (
            <g key={index}>
              <path
                d={createArc(slice.startAngle, slice.endAngle)}
                fill={slice.color}
                className="piechart-slice"
                onMouseEnter={() => setHoveredItem(slice)}
                onMouseLeave={() => setHoveredItem(null)}
              />
            </g>
          ))}
        </svg>

        {hoveredItem && (
          <div className="piechart-tooltip">
            <div className="piechart-tooltip-label">{hoveredItem.label}</div>
            <div className="piechart-tooltip-value">
              {!isPercentage && hoveredItem.amount} ({hoveredItem.percentage}%)
            </div>
          </div>
        )}
      </div>

      {legendpos === "bottom" && (
        <div className="piechart-legend mt-4 pt-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="piechart-legend-item"
            >
              <span className="piechart-legend-box" style={{ backgroundColor: item.color }}></span> 
              <span className="piechart-legend-text">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PieChart;