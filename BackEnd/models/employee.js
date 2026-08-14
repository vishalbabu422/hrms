const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const Employee = sequelize.define(
  "Employee",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    employee_code: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
    },

    attendance_code: {
      type: DataTypes.STRING(20),
      unique: true,
    },

    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    must_change_password: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    salutation: {
      type: DataTypes.ENUM("Mr", "Ms", "Mrs", "Dr"),
    },

    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    middle_name: DataTypes.STRING(50),

    last_name: {
      type: DataTypes.STRING(50),
    },

    employment_type: {
      type: DataTypes.STRING(150),
    },

    email: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },

    contact_no: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },

    date_of_joining: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    probation_end_date: DataTypes.DATEONLY,
    confirmation_date: DataTypes.DATEONLY,
    date_of_exit: DataTypes.DATEONLY,

    notice_period_days: DataTypes.INTEGER,

    account_status: {
      type: DataTypes.ENUM("PENDING", "ACTIVE", "REJECTED", "EXITED"),
      defaultValue: "PENDING",
    },

    hr_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    verified_by: {
      type: DataTypes.BIGINT,
    },

    verified_at: DataTypes.DATE,

    mode_of_working: {
      type: DataTypes.STRING(100),
    },

    state_of_working: {
      type: DataTypes.STRING(100),
    },

    employee_category: {
      type: DataTypes.STRING(100),
    },

    resignation_date: DataTypes.DATEONLY,

    is_gazetted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    organization_id: DataTypes.BIGINT,

    date_of_retirement: {
     type: DataTypes.DATEONLY,
    },

employee_group: {
  type: DataTypes.STRING(50),
  validate: {
    isIn: [["A", "B", "C", "D", "OTHER"]],
  },
},

notice_period_days: DataTypes.INTEGER,
  },
  {
    tableName: "employees",
    schema: "pmu",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

Employee.associate = (models) => {
  Employee.hasMany(models.EmployeeRefreshToken, {
    foreignKey: "employee_id",
  });

  Employee.hasMany(models.EmployeeRole, {
    foreignKey: "employee_id",
  });

  Employee.hasMany(models.EmployeeAchievement, {
    foreignKey: "employee_id",
    onDelete: "CASCADE",
  });
  Employee.hasMany(models.EmployeeAddress, {
    foreignKey: "employee_id",
    onDelete: "CASCADE",
  });

  Employee.hasMany(models.EmployeeAsset, {
    foreignKey: "employee_id",
    onDelete: "CASCADE",
  });
  Employee.hasOne(models.EmployeeBankDetail, {
    foreignKey: "employee_id",
    onDelete: "CASCADE",
  });
  Employee.hasOne(models.EmployeeDetail, {
    foreignKey: "employee_id",
    onDelete: "CASCADE",
  });
  Employee.hasMany(models.EmployeeDiscipline, {
    foreignKey: "employee_id",
    onDelete: "CASCADE",
  });
  Employee.hasMany(models.EmployeeExperience, {
    foreignKey: "employee_id",
    onDelete: "CASCADE",
  });
  Employee.hasMany(models.EmployeeFamilyMember, {
    foreignKey: "employee_id",
    onDelete: "CASCADE",
  });
  Employee.hasOne(models.EmployeeHealth, {
    foreignKey: "employee_id",
    onDelete: "CASCADE",
  });
  Employee.hasMany(models.EmployeeHobby, {
    foreignKey: "employee_id",
    onDelete: "CASCADE",
  });
  Employee.hasMany(models.EmployeeInsurance, {
    foreignKey: "employee_id",
    onDelete: "CASCADE",
  });
  Employee.hasMany(models.EmployeeLanguage, {
    foreignKey: "employee_id",
    onDelete: "CASCADE",
  });
  Employee.hasMany(models.EmployeePassportVisaDetail, {
    foreignKey: "employee_id",
    onDelete: "CASCADE",
  });
  Employee.hasMany(models.EmployeeQualification, {
    foreignKey: "employee_id",
    onDelete: "CASCADE",
  });
  Employee.hasOne(models.EmployeeScreeningTest, {
    foreignKey: "employee_id",
    onDelete: "CASCADE",
  });
  Employee.hasMany(models.EmployeeSkill, {
    foreignKey: "employee_id",
    onDelete: "CASCADE",
  });
  Employee.hasMany(models.EmployeeVaccination, {
    foreignKey: "employee_id",
    onDelete: "CASCADE",
  });
  Employee.hasMany(models.EmployeeVehicle, {
    foreignKey: "employee_id",
    onDelete: "CASCADE",
  });
  Employee.hasMany(models.Document, {
    foreignKey: "employee_id",
    onDelete: "CASCADE",
  });
  Employee.hasMany(models.Document, {
    foreignKey: "document_verified_by",
    as: "VerifiedDocuments",
  });

  Employee.belongsToMany(models.RoleMaster, {
    through: models.EmployeeRole,
    foreignKey: "employee_id",
    otherKey: "role_id",
  });

  Employee.belongsTo(models.Employee, {
    as: "Verifier",
    foreignKey: "verified_by",
  });

  Employee.hasMany(models.EmployeeDesignation, {
    foreignKey: "employee_id",
    as: "employeeDesignations",
  });

  Employee.hasMany(models.EmployeeDivision, {
    foreignKey: "employee_id",
    as: "employeeDivisions",
  });

  Employee.hasMany(models.EmployeeExamination, {
    foreignKey: "employee_id",
    as: "employeeExaminations",
  });

  Employee.hasMany(models.EmployeeWorkOrderDeployment, {
    foreignKey: "employee_id",
    onDelete: "CASCADE",
    as: "EmployeeWorkOrderDeployment",
  });

  Employee.hasOne(models.EmployeeWorkOrderDeployment, {
    foreignKey: "employee_id",
    onDelete: "CASCADE",
    as: "employeeWorkOrderDeployment",
  });

  Employee.hasMany(models.EmployeeTraining, {
    foreignKey: "employee_id",
    as: "EmployeeTraining",
  });

  Employee.hasMany(models.EmployeeWorkOrderLeave, {
    foreignKey: "employee_id",
    onDelete: "CASCADE",
    as: "employeeWorkOrderLeaves",
  });

  Employee.hasMany(models.EmployeeWorkOrderMpr, {
    foreignKey: "employee_id",
    onDelete: "RESTRICT",
    as: "employeeWorkOrderMprs",
  });

  Employee.hasMany(models.EmpSalaryStructure, {
    foreignKey: "employee_id",
    onDelete: "RESTRICT",
    as: "empSalaryStructure",
  });

  Employee.hasMany(models.EmployeeSalaryRegister, {
    foreignKey: "employee_id",
    onDelete: "RESTRICT",
    as: "employeeSalaryRegisters",
  });

  Employee.hasMany(models.EmployeeSalaryAddon, {
    foreignKey: "employee_id",
    onDelete: "RESTRICT",
    as: "employeeSalaryAddon",
  });
};

module.exports = Employee;
