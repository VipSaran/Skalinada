var fs = require('fs');
var exec = require('child_process').exec;

function execute(command, callback) {
  exec(command, function(error, stdout, stderr) {
    console.log("  command: ", command);
    console.log("  error: ", error);
    console.log("  stdout: ", stdout);
    console.log("  stderr: ", stderr);
    callback(stdout, stderr);
  });
}

var play = function(tone) {
  console.log('play()', tone);

  var toneFileName = 'pinkyfinger__piano-' + tone + '.wav';
  var command = 'omxplayer -o both sounds/' + toneFileName;
  execute(command, function(out, err) {
    if (err) {
      console.error(err);
    } else {
      console.log('played:', toneFileName);
    }
  });
};

exports.play = play;