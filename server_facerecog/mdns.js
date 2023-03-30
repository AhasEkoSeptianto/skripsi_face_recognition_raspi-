const mdns = require('mdns');
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const ad = mdns.createAdvertisement(mdns.tcp('ws'), 8080, {
  name: 'my-expressjs-server'
});
ad.start();

wss.on('connection', (ws) => {
  console.log('A client has connected');

  ws.on('message', (message) => {
    console.log(`Received message => ${message}`);

    if (message === 'request-ip') {
      const ipAddress = getESP32CAMIpAddress(); // Get the IP address of ESP32CAM
      ws.send(ipAddress);
    }
  });

  ws.on('close', () => {
    console.log('A client has disconnected');
  });
});