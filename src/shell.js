const { spawn } = require('child_process');

function run(command, ...args) {
  return new Promise((resolve, reject) => {
    let data = '';
    const cmd = spawn(command, args);

    cmd.stdout.on('data', _data => {
      data += _data.toString();
    });

    cmd.stderr.on('data', _data => {
      reject(_data.toString());
    });

    cmd.on('close', () => {
      resolve(data);
    });
  });
}

module.exports = {
  run,
};
