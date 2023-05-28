const express = require("express")
const { getAllUsersController, getAllDoctorsController, changeAcountStatusController,removeUserController } = require("../controllers/adminCtrl")
const authMiddleware = require("../middlewares/authMiddleware")

const router = express.Router()

//get All Users from DB
router.get("/getAllUsers", authMiddleware, getAllUsersController)

//get all doctors from DB
router.get("/getAllDoctors", authMiddleware, getAllDoctorsController)

//Account is Approved by admin for doctor
router.post("/changeAccountStatus", authMiddleware, changeAcountStatusController)

//remove user
router.post("/removeUser",authMiddleware,removeUserController)


module.exports = router