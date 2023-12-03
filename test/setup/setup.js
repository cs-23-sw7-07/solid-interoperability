const { spawn } = require("child_process");
const { copyFolder } = require("./folder-management");

module.exports = function setup() {
  return new Promise(async (resolve) => {
    await copyFolder("solid-server/Alice-pod", "solid-server/Alice-pod-copy");
    console.log("Server starting.");
    const child = spawn("node", ["./node_modules/@solid/community-server/bin/server.js", "-c", "./node_modules/@solid/community-server/config/file.json", "-f", "solid-server/"]);
    console.log("Spawned Community Solid server.");
    globalThis.__TEST_POD_SERVER_PID__ = child.pid;
    child.stdout.on("data", (data) => {
      const str = data.toString();
      console.log("[solid-server]", str);
      if (str.includes("Listening to server at http://localhost:3000/")) {
        setTimeout(resolve, 200);
      }
    });
    child.stderr.on("data", (data) => {
      const str = data.toString();
      console.log("[solid-server]", str);
    });
  });
};