const mongoose = require("mongoose")

const doctorSchema = new mongoose.Schema({
    userId:{
        type:String
    },
    firstName:{
        type:String,
        required:[true,'First name is required']
    },
    lastName:{
        type:String,
        required:[true,'Last name is required']
    },
    phone:{
        type:String,
        required:[true,'Phone no name is required']
    },
    email:{
        type:String,
        required:[true,'Email is required']
    },
    website:{
        type:String,
    },
    address:{
        type:String,
        required:[true,'Address is required']
    },
    specailization:{
        type:String,
        required:[true,'specailization is required']
    },
    experince:{
        type:String,
        required:[true,'Experince is required']
    },
    feesPerConsultation:{
        type:Number,
        required:[true,'fees is required']
    },
    status:{
        type:String,
        default:"pending"
    },
    timings:{
        type:Object,
        required:[true,'Work Timing is required']
    }

},{timestamps:true})
const DoctorModel = mongoose.model("doctor", doctorSchema)
module.exports = DoctorModel;