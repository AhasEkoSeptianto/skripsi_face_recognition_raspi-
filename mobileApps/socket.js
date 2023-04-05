const { io } = require("socket.io-client")

var socket = io("ws://192.168.30.71:3000", {
    transports: ["websocket", "polling"],
})

module.exports = socket