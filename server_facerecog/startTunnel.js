const localtunnel = require("localtunnel");


(async () => {
	const tunnel = await localtunnel({ port: 3000 });
	
	
	tunnel.on("close", () => {
		console.log("closed")
	})
})();
