var fs = require('fs');
var exec = require('child_process').exec;
var http = require('http');

var soundOrderRandom = true;

var pauseId;

function execute(command, callback) {
  exec(command, function(error, stdout, stderr) {
    console.log("  command: ", command);
    console.log("  error: ", error);
    console.log("  stdout: ", stdout);
    console.log("  stderr: ", stderr);
    callback(stdout, stderr);
  });
}

function randomFromInterval(from, to) {
  return Math.floor(Math.random() * (to - from + 1) + from);
}

var lastFileNameIndex = 0;

function getSoundFileName(random, callback) {
  console.log('getSoundFileName(); random=', random);

  // read dir each time for better robustness
  fs.readdir('sounds', function(err, list) {
    if (err) return done(err);

    var index = 0;
    if (random) {
      index = randomFromInterval(0, list.length - 1);
    } else {
      index = lastFileNameIndex;

      lastFileNameIndex++;

      // loop
      if (lastFileNameIndex == list.length) {
        lastFileNameIndex = 0;
      }
    }

    var fileName = list[index];
    console.log('index=', index);
    console.log('fileName=', fileName);
    callback(fileName);
  });
};

function getSoundFileDuration(soundFileName, callback) {
  var command = "omxplayer -i sounds/" + soundFileName + " 2>&1 | sed -n 's/.*Duration: //;s/, start:.*//p'";
  console.log('command=', command);
  execute(command, function(out, err) {
    var seconds = 5;
    if (err) {
      console.error(err);
      return callback(seconds);
    } else {
      console.log('length:', out);
      try {
        out = out.substring(0, out.indexOf('.'));
        console.log('out=', out);
        var tmp = '1970-01-01T' + out + 'Z';
        console.log('tmp=', tmp);
        var millis = Date.parse(tmp);
        console.log('millis=', millis);
        seconds = millis / 1000;
        console.log('seconds=', seconds);
      } catch (e) {
        console.error(e);
      }
      return callback(seconds);
    }
  });
}

var playSound = function(callback) {
  console.log('playSound()');

  // var soundFileName = 'Evil_laugh_Male_9-Himan-1598312646.mp3';

  getSoundFileName(soundOrderRandom, function(soundFileName) {
    getSoundFileDuration(soundFileName, function(seconds) {
      console.log('seconds=', seconds);

      lightUp(seconds);

      var command = 'omxplayer -o hdmi sounds/' + soundFileName;
      execute(command, function(out, err) {
        if (err) {
          console.error(err);
        } else {
          console.log('played:', soundFileName);
        }
        callback();
      });
    });
  });
};

var lightUp = function(seconds) {
  console.log('lightUp()');

  var options = {
    host: '192.168.2.115',
    port: '3000',
    path: '/api/light/' + seconds,
    method: 'GET'
  };

  var callback = function(response) {
    var str = '';

    response.on('data', function(chunk) {
      str += chunk;
    });

    response.on('end', function() {
      console.log(str);
    });
  }

  var req = http.request(options, callback);

  req.on('error', function(err) {
    console.error('error executing request', err);
  });

  req.end();
};

var scareThem = function(pause) {
  console.log('scareThem()');

  playSound(function() {
    if (pause !== "undefined" && pause != null) {
      console.log('starting indefinite play with', pause, 'delay');
      pauseId = setTimeout(function() {
        scareThem(pause);
      }, pause);
    }
  });
};

var stopPeriodicScare = function() {
  clearTimeout(pauseId);
};

exports.scareThem = scareThem;
exports.stopPeriodicScare = stopPeriodicScare;