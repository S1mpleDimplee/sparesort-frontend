import React from "react";
import "./ProgressBar.css";

const ProgressBar = ({
  value = 0,
  max = 100,
  height = "8px",
  color = "#2196f3",
  secondColor = "",
  backgroundColor = "rgba(255, 255, 255, 0.1)",
  showLabel = false,
  label = "",
  showPercentage = false,
  animated = false,
  striped = false,
  rounded = true,
  glowing = false,
  labelPosition = "top",
  className = "",
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const getBackgroundColor = () => {
    if (secondColor) {
      return `linear-gradient(90deg, ${color} 0%, ${secondColor} 100%)`;
    }
    return color;
  };

  const containerClasses = [
    "progress-bar-container",
    className,
    labelPosition === "right" ? "progress-bar-horizontal" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const barClasses = [
    "progress-bar-track",
    rounded ? "progress-bar-rounded" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const fillClasses = [
    "progress-bar-fill",
    animated ? "progress-bar-animated" : "",
    striped ? "progress-bar-striped" : "",
    glowing ? "progress-bar-glowing" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClasses}>
      {/* Label and Percentage - Top or Bottom */}
      {(showLabel || showPercentage) && labelPosition !== "inside" && labelPosition !== "right" && (
        <div
          className={`progress-bar-label-container ${
            labelPosition === "bottom" ? "progress-bar-label-bottom" : ""
          }`}
        >
          {showLabel && <span className="progress-bar-label">{label}</span>}
          {showPercentage && (
            <span className="progress-bar-percentage">{percentage.toFixed(0)}%</span>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div className="progress-bar-wrapper">
        <div
          className={barClasses}
          style={{
            height: height,
            backgroundColor: backgroundColor,
          }}
        >
          <div
            className={fillClasses}
            style={{
              width: `${percentage}%`,
              background: getBackgroundColor(),
            }}
          >
            {labelPosition === "inside" && showPercentage && (
              <span className="progress-bar-percentage-inside">
                {percentage.toFixed(0)}%
              </span>
            )}
          </div>
        </div>

        {labelPosition === "right" && (showLabel || showPercentage) && (
          <div className="progress-bar-label-right">
            {showLabel && <span className="progress-bar-label">{label}</span>}
            {showPercentage && (
              <span className="progress-bar-percentage">{percentage.toFixed(0)}%</span>
            )}
          </div>
        )}
      </div>

      {(showLabel || showPercentage) && labelPosition === "bottom" && (
        <div className="progress-bar-label-container progress-bar-label-bottom">
          {showLabel && <span className="progress-bar-label">{label}</span>}
          {showPercentage && (
            <span className="progress-bar-percentage">{percentage.toFixed(0)}%</span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;