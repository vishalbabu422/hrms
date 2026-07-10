import React from 'react'
import { CChartLine } from '@coreui/react-chartjs'

const LeaveTrendChart = () => {
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
            label: 'Leaves',
            data: [25, 55, 92, 55, 62, 85],
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34,197,94,0.15)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointHoverRadius: 6,
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
            grid: {
              color: '#f1f5f9',
            },
          },
        },
      }}
      style={{ height: '220px' }}
    />
  )
}

export default LeaveTrendChart