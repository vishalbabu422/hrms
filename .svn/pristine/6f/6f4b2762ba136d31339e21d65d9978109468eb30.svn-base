const router = require("express").Router();

router.use("/employee", require("./employee.routes"));
router.use("/designation", require("./designation/designation.routes"));
router.use("/division", require("./division/division.routes"));
router.use("/examinations", require("./exam/examination.routes"));
router.use("/workorder/:id/employee-work-order-leave", require("./employeeWOLeave/employeeWOLeave.routes"));
router.use("/workorder/:id/employee-work-order-mpr", require("./employeeWOMpr/employeeWOMpr.routes"));
module.exports = router;