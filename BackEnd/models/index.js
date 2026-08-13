const Organization = require("./organization");
const Employee = require("./employee");
const EmployeeRefreshToken = require("./employeeRefreshToken");
const RoleMaster = require("./roleMaster");
const EmployeeRole = require("./employeeRole");
const EmployeeAchievement = require("./employeeAchievement");
const EmployeeAddress = require("./employeeAddress");
const EmployeeAsset = require("./employeeAsset");
const EmployeeBankDetail = require("./employeeBankDetail");
const EmployeeDetail = require("./employeeDetail");
const EmployeeDiscipline = require("./employeeDiscipline");
const EmployeeExperience = require("./employeeExperience");
const EmployeeFamilyMember = require("./employeeFamilyMember");
const EmployeeHealth = require("./employeeHealth");
const EmployeeHobby = require("./employeeHobbie");
const EmployeeInsurance = require("./employeeInsurance");
const EmployeeLanguage = require("./employeeLanguage");
const EmployeePassportVisaDetail = require("./employeePassportVisaDetail");
const EmployeeQualification = require("./employeeQualification");
const EmployeeScreeningTest = require("./employeeScreeningTest");
const EmployeeSkill = require("./employeeSkill");
const EmployeeVaccination = require("./employeeVaccination");
const EmployeeVehicle = require("./employeeVehicle");
const Document = require("./document");
const EmpExtMapping = require("./empExtMapping");
const EmpanelmentMaster = require("./empanelmentMaster");
const WoDesgnMapping = require("./woDesgnMapping");
const WorkOrder = require("./workOrder");
const Permission = require("./Permission");
const RolePermission = require("./RolePermission");
const Module = require("./Module");
const DesignationMaster = require("./designationMaster");
const EmployeeDesignation = require("./employeeDesignation");
const GstCodeMaster = require("./gstCodeMaster");
const Designation = require("./designation");
const DivisionMaster = require("./divisionMaster");
const EmployeeDivision = require("./employeeDivision");
const CompanyMaster = require("./companyMaster");
const ExaminationMaster = require("./examinationMaster");
const EmployeeExamination = require("./employeeExamination");
const EmployeeLtc = require("./employeeLtc");
const EmployeeWorkOrderDeployment = require("./employeeWoDeployment");
const EmployeeTraining = require("./employeeTraining");
const EmployeeWorkOrderLeave = require("./employeeWorkOrderLeave");
const EmployeeWorkOrderMpr = require("./employeeWorkOrderMpr");
const SalaryComponent = require("./salaryComponent");
const SalaryStructure = require("./salaryStructure");
const SalaryStructureComponent = require("./salaryStructureComponent");
const EmpSalaryStructure = require("./employeeSalaryStructure");
const EmployeeSalaryRegister = require("./employeeSalaryRegister");
const EmployeeSalaryRegisterSnapshot = require("./employeeSalaryRegisterSnapshot");
const SalaryAddonMaster = require("./salaryAddonMaster");
const StateMaster = require("./stateMaster");
const DistrictMaster = require("./districtMaster");
const EmployeeSalaryAddon = require("./employeeSalaryAddon");
const ResourceRate = require("./resourceRate");
const WoMilestone = require("./milestone");
const AppSettings = require("./appSettings");

// Put all models inside object
const models = {
  GstCodeMaster,
  Designation,
  Organization,
  Employee,
  EmployeeRefreshToken,
  RoleMaster,
  EmployeeRole,
  EmployeeAchievement,
  EmployeeAddress,
  EmployeeAsset,
  EmployeeBankDetail,
  EmployeeDetail,
  EmployeeDiscipline,
  EmployeeExperience,
  EmployeeFamilyMember,
  EmployeeHealth,
  EmployeeHobby,
  EmployeeInsurance,
  EmployeeLanguage,
  EmployeePassportVisaDetail,
  EmployeeQualification,
  EmployeeScreeningTest,
  EmployeeSkill,
  EmployeeVaccination,
  EmployeeVehicle,
  Document,
  EmpExtMapping,
  EmpanelmentMaster,
  WoDesgnMapping,
  WorkOrder,
  Permission,
  RolePermission,
  Module,
  DesignationMaster,
  EmployeeDesignation,
  DivisionMaster,
  EmployeeDivision,
  CompanyMaster,
  ExaminationMaster,
  EmployeeExamination,
  EmployeeLtc,
  EmployeeWorkOrderDeployment,
  EmployeeTraining,
  EmployeeWorkOrderLeave,
  EmployeeWorkOrderMpr,
  SalaryComponent,
  SalaryStructure,
  SalaryStructureComponent,
  EmpSalaryStructure,
  EmployeeSalaryRegister,
  EmployeeSalaryRegisterSnapshot,
  SalaryAddonMaster,
  StateMaster,
  DistrictMaster,
  EmployeeSalaryAddon,
  ResourceRate,
  WoMilestone,
  AppSettings,
};

// Run associate method if exists
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = models;
