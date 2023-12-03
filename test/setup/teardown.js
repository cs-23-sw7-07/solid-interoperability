const { replaceFolder } = require("./folder-management");

module.exports = async function teardown() {
    await replaceFolder("solid-server/Alice-pod-copy", "solid-server/Alice-pod");
    process.kill(globalThis.__TEST_POD_SERVER_PID__);
  };