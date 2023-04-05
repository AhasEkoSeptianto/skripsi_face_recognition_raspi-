const { io } = require("socket.io-client")

var socket = io("ws://192.168.100.9:3000", {
    transports: ["websocket", "polling"],
})

module.exports = socket