import React from 'react';
import { useApp } from '../../context/AppContext';

const MapLegend = () => {
  return (
    <div className="map-floating-legend">
      <div className="legend-title">Landslide Prediction Risk</div>
      <div className="legend-items">
        <div className="legend-item">
          <div className="legend-swatch critical" />
          <span>Critical (76-100%)</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch high" />
          <span>High (51-75%)</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch moderate" />
          <span>Moderate (31-50%)</span>
        </div>
        <div className="legend-item">
          <div className="legend-swatch low" />
          <span>Safe / Low (&lt;30%)</span>
        </div>
      </div>
    </div>
  );
};

export default MapLegend;
