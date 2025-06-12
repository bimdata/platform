const spawn = require("child_process").spawn;
const path = require("path");

const exec = (cmd, args=[]) => new Promise((resolve, reject) => {
  console.log(`Started: ${cmd} ${args.join(" ")}`)
  const process = spawn(cmd, args, { stdio: "inherit" });
  process.on("close", code => {
    if (code !== 0) {
      const error = new Error(`Invalid status code: ${code}`);
      error.code = code;
      return reject(error);
    }
    return resolve(code);
  });
  process.on("error", reject);
});

const main = async () => {
  try {
    await exec("bash", [path.join(__dirname, "./main.sh")]);
  } catch (error) {
    console.error(error);
    console.error(error.stack);
    process.exit(error.code || -1);
  }
};

main();
