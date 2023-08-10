const { exec } = require("child_process");
const m = require("./mongodb/mongoose.js");

exec(
  "curl -s localhost:4040/api/tunnels | jq -r .tunnels[0].public_url",
  (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      return;
    }

    console.log(stdout);
    m.saveHost(stdout.replace(/\r?\n|\r/g));
  }
);
