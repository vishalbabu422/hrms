import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
)

const centerTextPlugin = {
  id: 'centerText',
  afterDraw(chart) {
    const { ctx } = chart

    const meta = chart.getDatasetMeta(0)
    if (!meta.data.length) return

    const x = meta.data[0].x
    const y = meta.data[0].y

    const total = chart.data.datasets[0].data.reduce(
      (sum, value) => sum + value,
      0,
    )

    ctx.save()

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    ctx.fillStyle = '#6b7280'
    ctx.font = '500 14px Arial'
    ctx.fillText('Total', x, y - 12)

    ctx.fillStyle = '#111827'
    ctx.font = '700 34px Arial'
    ctx.fillText(total, x, y + 18)

    ctx.restore()
  },
}

const WorkOrderPieChart = () => {
  const data = {
    labels: ['Completed', 'In Progress', 'Pending', 'Delayed'],
    datasets: [
      {
        data: [106, 83, 35, 12],
        backgroundColor: [
          '#4CAF50',
          '#4285F4',
          '#F59E0B',
          '#EF4444',
        ],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
  }

  return (
    <div className="pie-chart-wrapper">
      <Doughnut
        data={data}
        options={options}
        plugins={[centerTextPlugin]}
      />
    </div>
  )
}

export default WorkOrderPieChart