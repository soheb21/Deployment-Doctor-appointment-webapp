const express = require("express");
const { loginController, registerController, authctrl, applyDoctorController, notificationController, DeleteAllnotificationController, getListDoctorsController, bookAppointmentController, bookingAvailablityController,getAppointmentController } = require("../controllers/userCtrl");
const authMiddleware = require("../middlewares/authMiddleware");

//router object
const router = express.Router();

//routes

//LOGIN ||POST
router.post("/login", loginController)

//REGISTER ||POST
router.post("/register", registerController)

//Apply Doctor
router.post("/apply-doctor", authMiddleware, applyDoctorController)

//All Notification
router.post("/notifications", authMiddleware, notificationController)

//Delete All Notification
router.post("/deleteAllNotifications", authMiddleware, DeleteAllnotificationController)

//list all doctors in homepage 
router.get("/getListDoctors", authMiddleware, getListDoctorsController)

//Middleware
router.post("/getUserData", authMiddleware, authctrl)

//Book Appointment

router.post("/book-appointment", authMiddleware, bookAppointmentController)

//Booking Availabilty
router.post("/booking-availablity", authMiddleware, bookingAvailablityController)

//get Appointment list
router.get("/getAppointmentList",authMiddleware,getAppointmentController)


module.exports = router