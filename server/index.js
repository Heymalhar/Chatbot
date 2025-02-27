const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messagesRoute')
const socket = require('socket.io');

const app = express()
require("dotenv").config()

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes)

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("The database connection has been established successfully.");
    console.log("If you are reading this, everything is working just fine!")
}).catch((err) => {
    console.log("An error occured: ", err)
});

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on PORT ${process.env.PORT}`)
});

const io = socket(server, {
    cors:{
        origin:"http://localhost:3000",
        credentials: true,
    },
});

global.onlineUsers = new Map();

io.on("connection", (socket)=>{
    global.chatSocket = socket;
    socket.on("add-user",(userId)=>{
        onlineUsers.set(userId, socket.id);
    })

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-received", data.messsge)
        }
    })
})