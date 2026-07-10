export const validateQualifications = (data) => {
  return data.map((item) => {
    const errors = {}

    const name = item.qualification_name?.trim()
    const specialization = item.specialization?.trim()
    const institute = item.institute_name?.trim()
    const board = item.board_university?.trim()
    const grade = item.grade?.trim()
    const year = item.year_of_passing
    const percentage = item.percentage

    // =========================
    // ✅ REQUIRED (DB NOT NULL)
    // =========================
    if (!name) {
      errors.qualification_name = "Qualification Name is required"
    }

    // =========================
    // ✅ VARCHAR LENGTH CHECKS
    // =========================
    if (name && name.length > 200) {
      errors.qualification_name = "Max 200 characters allowed"
    }

    if (specialization && specialization.length > 150) {
      errors.specialization = "Max 150 characters allowed"
    }

    if (institute && institute.length > 200) {
      errors.institute_name = "Max 200 characters allowed"
    }

    if (board && board.length > 200) {
      errors.board_university = "Max 200 characters allowed"
    }

    if (grade && grade.length > 50) {
      errors.grade = "Max 50 characters allowed"
    }

    // =========================
    // ✅ NUMBER VALIDATION
    // =========================
    if (year) {
      if (!/^\d{4}$/.test(year)) {
        errors.year_of_passing = "Enter valid 4-digit year"
      }
    }

    if (percentage) {
      const num = parseFloat(percentage)

      if (isNaN(num) || num < 0 || num > 100) {
        errors.percentage = "Percentage must be between 0–100"
      }
    }

    return errors
  })
}