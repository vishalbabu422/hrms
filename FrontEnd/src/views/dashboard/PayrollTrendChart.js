import React from 'react'
import { CChartLine } from '@coreui/react-chartjs'

const PayrollTrendChart = () => {
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
            label: 'Payroll (Cr)',
            data: [2.0, 2.8, 3.4, 3.5, 4.1, 4.8],
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139,92,246,0.12)',
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
          tooltip: {
            callbacks: {
              label: function (context) {
                return `₹ ${context.raw} Cr`
              },
            },
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
            ticks: {
              callback: function (value) {
                return `₹ ${value} Cr`
              },
            },
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

export default PayrollTrendChart