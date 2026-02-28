import React, { useState } from "react";
import "./BarChart.css";

const BarChart = ({ data = [], maxValue = null, title = "", height = "250px"}) => {
  if (!data || data.length === 0) {
    data = [{ label: "Geen data", value: 0, color: "#2196F3" }];
  }

  const [hoveredItem, setHoveredItem] = useState(null);

  // Calculate max value for scaling
  const calculatedMax = maxValue || Math.max(...data.map((item) => item.value));
  const roundedMax = Math.ceil(calculatedMax / 10) * 10;

  // Generate Y-axis labels 
  const ySteps = 6;
  const yLabels = Array.from({ length: ySteps }, (_, i) => {
    return roundedMax - (roundedMax / (ySteps - 1)) * i;
  });

  return (
    <div className="barchart-wrapper">
      {title && <div className="barchart-title">{title}</div>}

      <div className="barchart-container" style={{ height: height }}>
        <div className="barchart-y-axis">
          {yLabels.map((label, index) => (
            <div key={index} className="barchart-y-label">
              {Math.round(label)}
            </div>
          ))}
        </div>

        <div className="barchart-chart">
          <div className="barchart-grid">
            {yLabels.map((_, index) => (
              <div key={index} className="barchart-grid-line"></div>
            ))}
          </div>

          <div className="barchart-bars">
            {data.map((item, index) => {
              const heightPercent = (item.value / roundedMax) * 100;
              return (
                <div key={index} className="barchart-bar-container">
                  <div className="barchart-bar-inner">
                    <div
                      className="barchart-bar"
                      style={{
                        height: `${heightPercent}%`,
                        backgroundColor: item.color || "#2196F3",
                      }}
                      onMouseEnter={() => setHoveredItem(item)}
                      onMouseLeave={() => setHoveredItem(null)}
                    ></div>
                  </div>
                  <div className="barchart-x-label">{item.label}</div>
                </div>
              );
            })}
          </div>

          {hoveredItem && (
            <div className="barchart-tooltip">
              <div className="barchart-tooltip-label">{hoveredItem.label}</div>
              <div className="barchart-tooltip-value">€{hoveredItem.value}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BarChart;