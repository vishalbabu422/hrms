export const calculateAmounts = (
  replica,
  options = {
    totalAmount: true,
    cgst: true,
    sgst: true,
    igst: true,
  },
) => {
  const {
    monthly_unit_rate = 0,
    req_person_count = 0,
    months = 0,
    partialMonthFactor = 0,
    cgst_percent = 0,
    sgst_percent = 0,
    igst_percent = 0,
  } = replica

  const A = Number(monthly_unit_rate)
  const B = Number(req_person_count)
  const X = Number(months)
  const P = Number(partialMonthFactor)

  if (!A || !B) {
    return {}
  }

  const result = {}

  // Only calculate base if needed
  let totalAmount = 0

  if (options.totalAmount || options.cgst || options.sgst || options.igst) {
    const durationAmount = (X + P) * A
    totalAmount = Number((durationAmount * B).toFixed(2))
  }

  if (options.totalAmount) {
    result.totalAmount = totalAmount
  }

  if (options.cgst) {
    result.cgst_amount = Number(((totalAmount * cgst_percent) / 100).toFixed(2))
  }

  if (options.sgst) {
    result.sgst_amount = Number(((totalAmount * sgst_percent) / 100).toFixed(2))
  }

  if (options.igst) {
    result.igst_amount = Number(((totalAmount * igst_percent) / 100).toFixed(2))
  }

  return result
}

export const calculateDuration = (from, to) => {
  if (!from || !to) {
    return {}
  }

  const start = new Date(from)
  const end = new Date(to)

  if (start > end) {
    return {}
  }

  let months = 0
  let partialMonthFactor = 0

  let cursor = new Date(start)

  while (cursor <= end) {
    const y = cursor.getFullYear()
    const m = cursor.getMonth()

    const monthStart = new Date(y, m, 1)
    const monthEnd = new Date(y, m + 1, 0)

    const effectiveStart = cursor > monthStart ? cursor : monthStart
    const effectiveEnd = end < monthEnd ? end : monthEnd

    const fullMonth =
      effectiveStart.getDate() === 1 && effectiveEnd.getDate() === monthEnd.getDate()

    if (fullMonth) {
      months++
    } else {
      const partialDays = effectiveEnd.getDate() - effectiveStart.getDate() + 1

      partialMonthFactor += partialDays / monthEnd.getDate()
    }

    cursor = new Date(y, m + 1, 1)
  }

  const totalMonths = months + partialMonthFactor

  return {
    duration_days: totalMonths.toFixed(2) + ' Month(s)',
    months,
    partialMonthFactor,
  }
}
