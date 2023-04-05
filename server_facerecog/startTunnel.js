const localtunnel = require("localtunnel");
const m = require('./mongodb/mongoose')

const main = async () => {
	const tunnel = await localtunnel({ port: 3000 });
	
	host = tunnel.url;
	m.saveHost(host)	
	tunnel.on("close", () => {
		console.log("closed")
	})
}

// (async () => {
// 	const tunnel = await localtunnel({ port: 3000 });
	
// 	host = tunnel.url;
	
// 	tunnel.on("close", () => {
// 		console.log("closed")
// 	})
// })();
main()