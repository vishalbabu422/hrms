export const validateSkills = (skills) => {
  const errors = [];

  skills.forEach((s, index) => {
    const err = {};

    if (!s.skill_name || s.skill_name.trim() === "") {
      err.skill_name = "Skill name is required";
    }

    if (s.experience_years) {
      const val = Number(s.experience_years);
      if (isNaN(val) || val < 0 || val > 50) {
        err.experience_years = "Enter valid experience (0–50)";
      }
    }

    if (s.skill_name && s.skill_name.length > 100) {
      err.skill_name = "Max 100 characters allowed";
    }

    if (s.remarks && s.remarks.length > 255) {
      err.remarks = "Max 255 characters allowed";
    }

    errors[index] = err;
  });

  return errors;
};