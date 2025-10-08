// src/components/ResultChart.jsx (Manual Chart.js Integration)
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto'; // Install chart.js: npm install chart.js

export default function ResultChart({ data }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) {
      return <div>No data to display</div>;
    }

    const ctx = chartRef.current.getContext('2d');
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(item => item.label),
        datasets: [{
          label: 'Votes',
          data: data.map(item => item.value),
          backgroundColor: ['#4B5EAA', '#6C757D', '#28A745', '#DC3545', '#FFC107'],
          borderColor: ['#4B5EAA', '#6C757D', '#28A745', '#DC3545', '#FFC107'],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Number of Votes' }
          }
        },
        plugins: {
          legend: { position: 'top' },
          tooltip: { enabled: true }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  if (!data || data.length === 0) {
    return <div>No data to display</div>;
  }

  return <canvas ref={chartRef} />;
}