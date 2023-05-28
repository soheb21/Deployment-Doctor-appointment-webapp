const express = require("express");
const { getDoctorInfoController, updateProfileController, getDoctorByIdController, doctorAppointmentsController, updateStatusController, deleteDoctorAccount } = require("../controllers/doctorCtrl");
const authMiddleware = require("../middlewares/authMiddleware")
const router = express.Router()

//get Singal Doctor info

router.post("/getDoctorInfo", authMiddleware, getDoctorInfoController)

//update the doctor profile
router.put("/updateDoctorProfile", authMiddleware, updateProfileController)

//Get Singal Doctor info
router.post("/getDoctorById", authMiddleware, getDoctorByIdController)

//fetch doctor apoointment
router.get("/getDoctorAppointmnt", authMiddleware, doctorAppointmentsController)

//update Appointment status
router.post("/update-status", authMiddleware, updateStatusController)

//delete account of doctor
router.post("/deleteAccount",authMiddleware,deleteDoctorAccount)
module.exports = router;