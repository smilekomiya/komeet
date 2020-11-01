const log4js = require("log4js")
const express = require("express")
const http = require("http")
const socket = require("socket.io")

const logger = log4js.getLogger()
logger.level = "debug"

const app = express()
const server = http.createServer(app)
const io = socket(server)

let komeetRooms = {}

io.on("connection", socket => {
    socket.on("join room", roomID => {
        logger.debug(roomID + " joined!!")
        if (komeetRooms[roomID]) {
            komeetRooms[roomID].push(socket.id)
        } else {
            komeetRooms[roomID] = [socket.id]
        }
        logger.debug(komeetRooms)
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

    socket.on("disconnect", reason => {
        komeetRooms = Object.keys(komeetRooms).reduce((accumlator, current) => ({
            ...accumlator,
            [current]: komeetRooms[current].filter(socketID => socketID != socket.id)
        }), {})
        
        Object.keys(komeetRooms).forEach(roomID => {
            if (komeetRooms[roomID].length == 0) {
                delete komeetRooms[roomID]
            }
        })
    })
})

server.listen(8888, () => console.log('server is running on port 8888'))