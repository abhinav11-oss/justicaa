import React, { useEffect } from 'react';
import mermaid from 'mermaid';

// Initialize Mermaid.js
mermaid.initialize({
  startOnLoad: false,
  theme: 'neutral', // A good default theme that works well in light/dark mode
  fontFamily: 'Inter, sans-serif',
});

interface FlowchartProps {
  chartDefinition: string;
}

export const Flowchart: React.FC<FlowchartProps> = ({ chartDefinition }) => {
  useEffect(() => {
    // When the component is ready, tell Mermaid to render any diagrams
    mermaid.run();
  }, [chartDefinition]);

  // The 'key' prop helps React re-render the component correctly if the chart changes
  return (
    <div className="mermaid" key={chartDefinition}>
      {chartDefinition}
    </div>
  );
};