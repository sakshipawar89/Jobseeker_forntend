// src/pages/PieChart.tsx

import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';

// Register necessary chart elements
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

interface PieChartProps {
  data: {
    labels: string[];
    values: number[];
  };
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        data: data.values,
        backgroundColor: ['#ff9999', '#66b3ff', '#99ff99'],
        hoverBackgroundColor: ['#ff6666', '#3399ff', '#66ff66'],
      },
    ],
  };

  return <Pie data={chartData} />;
};

export default PieChart;
