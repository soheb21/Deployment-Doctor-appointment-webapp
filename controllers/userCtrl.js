const UserModel = require("../models/userModels")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const DoctorModel = require("../models/doctorModel")
const AppointmentModel = require("../models/appointmentModel")
const moment = require("moment")

const registerController = async (req, res) => {
    try {
        const existingUser = await UserModel.findOne({ email: req.body.email })
        if (existingUser) {
            return res.status(200).send({ message: "User Already Exist", success: false })
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        req.body.password = hashedPassword; //ab user ko password ko hum replace karadenge hash password se
        const newUser = new UserModel(req.body)
        await newUser.save();
        res.status(201).send({ message: "Register Successfully", success: true })

    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: `Register Controller ${error.message}` })
    }
}
const loginController = async (req, res) => {
    try {
        const verifyUser = await UserModel.findOne({ email: req.body.email })
        if (!verifyUser) {
            return res.status(200).send({ message: "User not found", success: false })
        }
        const isMatch = await bcrypt.compare(req.body.password, verifyUser.password)
        if (!isMatch) { return res.status(200).send({ message: "Invalid Password", success: false }) }

        const token = await jwt.sign({ id: verifyUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" })
        res.status(201).send({ message: "Login Successfully", success: true, token })

    } catch (error) {
        res.status(500).send({ success: false, message: `Login Controller ${error.message}` })

    }
}
const applyDoctorController = async (req, res) => {
    try {
        const doctor = new DoctorModel({ ...req.body, status: "pending" })
        await doctor.save();
        const adminUser = await UserModel.findOne({ isAdmin: true })
        const notification = adminUser.notification
        notification.push({
            type: "apply-doctor-account",
            message: `${doctor.firstName} ${doctor.lastName} Has Applied for a Doctor Account`,
            data: {
                doctorId: doctor._id,
                name: doctor.firstName + " " + doctor.lastName,
                onClickPath: "/admin/doctors"

            }
        })
        await UserModel.findByIdAndUpdate(adminUser._id, { notification })

        res.status(201).send({ message: "Applying for Doctor Account is Successfull", success: true })
    } catch (error) {
        res.status(500).send({ success: false, message: `Apply-Doctor Controller ${error}` })
    }
}

const notificationController = async (req, res) => {
    try {
        const user = await UserModel.findOne({ _id: req.body.userId });
        const notification = user.notification;
        const seennotification = user.seennotification;
        seennotification.push(...notification);
        user.notification = [];
        user.seennotification = notification;
        const updateUser = await user.save();
        // console.log(updateUser)
        res.status(201).send({
            message: "All notification marked is read",
            success: true,
            data: updateUser
        })
    } catch (error) {
        res.status(500).send({ success: false, message: `Notification Controller ${error}` })
    }
}
//Delete All Notification
const DeleteAllnotificationController = async (req, res) => {
    try {
        const user = await UserModel.findOne({ _id: req.body.userId });
        user.notification = [];
        user.seennotification = [];
        const updateUser = await user.save();
        console.log(updateUser)
        res.status(201).send({
            message: "Deleted All notification is done",
            success: true,
            data: updateUser
        })
    } catch (error) {
        res.status(500).send({ success: false, message: `Delete All Notification Controller ${error}` })
    }
}

const getListDoctorsController = async (req, res) => {
    try {
        const AllDoctors = await DoctorModel.find({ status: "approved" })
        res.status(200).send({
            success: true,
            message: "Fetching Doctor list is Successful",
            data: AllDoctors
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Failed to Get Doctor List",
            error
        })
    }
}


const bookAppointmentController = async (req, res) => {
    try {
        req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
        req.body.time = moment(req.body.time, "HH:mm").toISOString();
        req.body.status = "pending";
        const newAppointment = new AppointmentModel(req.body)
        await newAppointment.save();
        const user = await UserModel.findOne({ _id: req.body.doctorInfo.userId })
        user.notification.push({
            type: "New-Appointment-request",
            message: `A new Apppointment Request from ${req.body.userInfo.name}`,
            onClickPath: "/doctor-appointments"
        })
        await user.save();
        res.status(200).send({
            success: true,
            message: "Appointment Booked Succesfully",
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Failed to Appointment Booking",
            error
        })
    }
}
const bookingAvailablityController = async (req, res) => {
    try {
        const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
        const fromTime = moment(req.body.time, "HH:mm").subtract(1, "hour").toISOString();
        const toTime = moment(req.body.time, "HH:mm").add(1, "hour").toISOString();
        const doctorId = req.body.doctorId;
        const appointments = await AppointmentModel.find({
            doctorId,
            date,
            time: {
                $gte: fromTime,
                $lte: toTime
            }

        })
        if (appointments.length > 0) {
            return res.status(200).send({
                success: true,
                message: "Appointment no available at this time"
            })
        } else {
            return res.status(200).send({
                success: true,
                message: "Appointment available"
            })
        }

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Failed to Booking Availablity",
            error
        })
    }
}
const getAppointmentController = async (req, res) => {
    try {
        const appointments = await AppointmentModel.find({ userId:req.body.userId })

        res.status(200).send({
            success: true,
            message: "Appointment list fetched Successfull",
            data: appointments
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Failed to Fetching Appointment list",
            error
        })
    }
}

const authctrl = async (req, res) => {
    try {
        const user = await UserModel.findById({ _id: req.body.userId })
        user.password = undefined;
        if (!user) {
            return res.status(200).send({ message: "User not found", success: false })
        }
        else {
            res.status(200).send({
                success: true,
                data: user
            })
        }

    } catch (error) {
        res.status(500).send({ success: false, message: "Auth error" })
    }
}

module.exports = { loginController, registerController, applyDoctorController, notificationController, DeleteAllnotificationController, getListDoctorsController, bookAppointmentController, bookingAvailablityController, getAppointmentController, authctrl }