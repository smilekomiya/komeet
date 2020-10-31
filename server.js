const express = require("express")
const http = require("http")
const socket = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = socket(server)

const komeetRooms = {}

io.on("connection", socket => {
    socket.on("join room", roomID => {
        if (komeetRooms[roomID]) {
            komeetRooms[roomID].push(socket.id)
        } else {
            komeetRooms[roomID] = [socket.id]
        }

        const otherUser = komeetRooms[roomID].find(socketID => socketID !== socket.id)
        if (otherUser) {
            socket.emit("other user", otherUser)
            socket.to(otherUser).emit("user joined", socket.id)
        }
    })

    socket.on("offer", payload => {
        io.to(payload.target).emit("offer", payload)
    })

    socket.on("answer", payload => {
        io.to(payload.target).emit("answer", payload)
    })

    socket.on("ice-candidate", incoming => {
        io.to(incoming.target).emit("ice-candidate", incoming.candidate)
    })
})

server.listen(8888, () => console.log('server is running on port 8888'))