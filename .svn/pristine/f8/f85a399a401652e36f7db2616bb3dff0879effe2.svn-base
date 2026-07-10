import React from 'react'
import { CChartLine } from '@coreui/react-chartjs'

const WorkOrderTrendChart = () => {
  return (
    <CChartLine
      data={{
        labels: [
          'Dec 2024',
          'Jan 2025',
          'Feb 2025',
          'Mar 2025',
          'Apr 2025',
          'May 2025',
        ],
        datasets: [
          {
            data: [60, 105, 95, 150, 100, 130, 200],
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37,99,235,0.08)',
            fill: true,
            tension: 0.4,
            pointRadius: 3,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
          },
        },
      }}
      style={{ height: '220px' }}
    />
  )
}

export default WorkOrderTrendChart