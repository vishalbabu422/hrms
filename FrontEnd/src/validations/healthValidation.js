export const validateHealth = (health) => {
  const errors = {};

  // Height
  if (health.height_cm) {
    const h = Number(health.height_cm);
    if (isNaN(h) || h <= 0) {
      errors.height_cm = "Enter valid height";
    }
  }

  // Weight
  if (health.weight_kg) {
    const w = Number(health.weight_kg);
    if (isNaN(w) || w <= 0) {
      errors.weight_kg = "Enter valid weight";
    }
  }

  // Handicapped → category required
  if (health.is_handicapped && !health.physical_disability_category) {
    errors.physical_disability_category = "Disability category is required";
  }

  // Health issue → remarks required
  if (health.has_health_issues && !health.health_issue_remarks) {
    errors.health_issue_remarks = "Remarks required";
  }

  return errors;
};