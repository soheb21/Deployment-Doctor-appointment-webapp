const express = require("express");
const morgan = require("morgan")
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path")

//.dotenv config
dotenv.config();

//MongoDB Connection
connectDB();

//rest object
const app = express();

//middleware
app.use(express.json())
app.use(morgan("dev"))

//routes
app.use("/api/v1/user", require("./routes/userRoutes"))

//admin routes
app.use("/api/v1/admin", require("./routes/adminRoutes"))

//admin routes
app.use("/api/v1/doctor", require("./routes/doctorRoutes"))

//static files
app.use(express.static(path.join(__dirname,"./client/build")))

app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"./client/build/index.html"))
})

//listen port
const port = process.env.PORT || 8000
app.listen(port, () => console.log(`Server Running in ${process.env.NODE_MODE} Mode on port ${port}`.bgCyan.white))