const DoctorModel = require("../models/doctorModel");
const UserModel = require("../models/userModels")

const getAllUsersController = async (req, res) => {
    try {
        const users = await UserModel.find({});
        res.status(200).send({
            success: true,
            message: "Fetching All users list Successfully",
            data: users
        })
    } catch (error) {
        console.log(error)
        res.status(501).send({
            success: false,
            message: "Error while fetching Users",
            error
        })
    }
}
const getAllDoctorsController = async (req, res) => {
    try {
        const doctors = await DoctorModel.find({})
        res.status(200).send({
            success: true,
            message: "Fetching All Doctors list Successfully",
            data: doctors
        })
    } catch (error) {
        console.log(error)
        res.status(501).send({
            success: false,
            message: "Error while fetching Users",
            error
        })
    }
}
//Approved user by Admin
const changeAcountStatusController = async (req, res) => {
    try {
        const { doctorId, status } = req.body
        const doctor = await DoctorModel.findByIdAndUpdate(doctorId, { status })
        const user = await UserModel.findOne({ _id: doctor.userId })
        const notification = user.notification;
        notification.push({
            type: "doctor-account-request-updated",
            message: `Your Doctor Account request has ${status} `,
            onClick: "/notifications"
        })
        user.isDoctor = status === "approved" ? true : false
        await user.save();
        res.status(201).send({
            success: true,
            message: "Account Status Updated",
            data: doctor
        })
    } catch (error) {
        res.status(501).send({
            succes: false,
            message: `not Change Account Status Controller ${error}`
        })
    }

}
const removeUserController = async (req, res) => {
    try {
        const user = await UserModel.findOneAndDelete({ email: req.body.email })
        const doctor = await DoctorModel.findOneAndDelete({ email: user.email })
        if (doctor) {
            res.status(201).send({
                success: true,
                message: "User remove Successfully",
                data: doctor
            })
        }

    } catch (error) {
        res.status(501).send({
            succes: false,
            message: "User Remove failer"
        })
    }
}
module.exports = { getAllUsersController, getAllDoctorsController, changeAcountStatusController, removeUserController }