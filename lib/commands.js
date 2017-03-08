var spawn = require('child_process').spawn
var commands = {
  playAndExitLinux: {
    command: "vlc",
    args: ["--play-and-exit"]
  },
  getYoutubePlayLink: {
    command: "youtube-dl",
    args: ["-g"] 
  },
  getYoutubePlayId: {
    command: "youtube-dl",
    args: ["--get-id"]
  },
  playAndExitWindows: {
    command: "vlc",
    args: ["-Incurse", "--vout", "none", "--play-and-exit"]
  },
  getInfo: {
    command: "youtube-dl",
    args: ["-j"]
  },
  volChangeLinux: {
    command: "pactl",
    args: ["--","set-sink-volume","0"]
  },
  volChangeWin: {
    command: "nircmd.exe",
    args: ["changesysvolume"]
  },
  volSetWin: {
    command: "nircmd.exe",
    args: ["setsysvolume"]
  }
};

var runCommand = function(command, args) {
  if (!args) {
   args = [];
  }
  var compArgs = commands[command].args.concat(args);
  return spawn(commands[command].command, compArgs);
}
module.exports = {
  runCommand: runCommand
} 