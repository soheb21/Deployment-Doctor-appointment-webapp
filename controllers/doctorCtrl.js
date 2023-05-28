const AppointmentModel = require("../models/appointmentModel")
const DoctorModel = require("../models/doctorModel")
const UserModel = require("../models/userModels")

const getDoctorInfoController = async (req, res) => {
    try {
        const doctor = await DoctorModel.findOne({ userId: req.body.userId })
        res.status(201).send({
            success: true,
            message: "Get Doctor info is Successfull",
            data: doctor
        })
    } catch (error) {
        console.log("Get Doctor Info have an" + error)
        res.status(500).send({
            success: false,
            message: "Get Doctor info failed..",
            error
        })
    }
}
//update doctor profile
const updateProfileController = async (req, res) => {
    try {
        const doctor = await DoctorModel.findOneAndUpdate({ userId: req.body.userId }, req.body);
        res.status(201).send({
            success: true,
            message: "Doctor profile is updated",
            data: doctor
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Doctor Profile Update is failed..",
            error
        })
    }
}
const getDoctorByIdController = async (req, res) => {
    try {
        const doctor = await DoctorModel.findOne({ _id: req.body.doctorId })
        res.status(201).send({
            success: true,
            message: "Singal Doctor info is fetched successful",
            data: doctor
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Doctor info not available",
            error
        })
    }
}
const doctorAppointmentsController = async (req, res) => {
    try {
        const doctor = await DoctorModel.findOne({ userId: req.body.userId })
        const appointments = await AppointmentModel.find({ doctorId: doctor._id })
        res.status(201).send({
            success: true,
            message: "Doctor appointment fetch successfully",
            data: appointments
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to load Doctor Appointment",
            error
        })
    }
}
const updateStatusController = async (req, res) => {
    try {
        const { appointmentId, status } = req.body;
        const appointments = await AppointmentModel.findByIdAndUpdate(appointmentId, { status })
        const user = await UserModel.findOne({ _id: appointments.userId })
        const notification = user.notification
        notification.push({
            type: "Ststus-Updated",
            message: `you appointment has been updated ${status}`,
            onClickPath: "/doctor-appointments"
        })
        await user.save();
        res.status(200).send({
            sucess: true,
            message: "Status Updated Successfully"
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to update appointment status",
            error
        })
    }
}
const deleteDoctorAccount = async (req, res) => {
    try {
        const doctor = await DoctorModel.findOneAndDelete({ userId: req.body.userId })
        const user = await UserModel.findOneAndUpdate({ _id: doctor.userId }, { isDoctor: "false" })
        await user.save();
        res.status(200).send({
            sucess: true,
            message: "Account deleted Successfully"
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Failed to delete Account",
            error
        })
    }
}

module.exports = { getDoctorInfoController, updateProfileController, getDoctorByIdController, doctorAppointmentsController, updateStatusController, deleteDoctorAccount }