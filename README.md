<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Skalinada](#skalinada)
  - [Intro](#intro)
  - [How it works](#how-it-works)
  - [Setup](#setup)
    - [Python](#python)
    - [JavaScript](#javascript)
  - [Running](#running)
  - [Thanks](#thanks)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Skalinada
A MicroPython (with a little help from JavaScript) implementation of "Musical Stairs" project.

## Intro
The project relies on WiPy for protocell readings and a RaspberryPi for playing the dedicated sounds and the current version uses only 5 photocell sensors and is limited to 5 tones, namely: A, B, C, D, E.

WiPy + RasPi combo is used as I had a "free" WiPy and a RasPi that was already connected to home stereo. Only thing to solve was porting of Python code for reading the photocell sensors (based on an [Adafruit tutorial](https://learn.adafruit.com/basic-resistor-sensor-reading-on-raspberry-pi/basic-photocell-reading)) [to MicroPython](http://forum.micropython.org/viewtopic.php?f=11&t=1118) and communicating the readings via LAN to RasPi.

## How it works
Each of the available photocells is cycled through until the light is "lost". Afer that, the app starts counting how long the current cell is without the light source and, when reaching a dedicated threshold (`DARK_ACCUMULATED`), fires a "play sound" request.
Half-second `DELAY` after playing a sound ensures a "reasonable" timeout between tones.

As MicroPython (to my knowledge) doesn't have a high level HTTP library/module, a communication on a socket level was needed, but it does the job sufficiently (but w/o any error handling, mind you) of relaying the tone to the dedicated "player" (i.e. RaspberryPi in my case).

The "player" listens on a dedicated route (`GET /play/:tone`) and uses `omxplayer` to play the corresponding piano tone from `sounds` folder.

## Setup

### Python
Currently, as can be seen from `read_photo.py`, the Python photocell reading "module", these GPIOs are used: GP4, GP0, GP3, GP31, GP30.

Also, one can experiment with different `DARK_ACCUMULATED` threshold and `DELAY` between tones.

For connecting to the right "player", the `player_address` and `player_port` need to be the same as configured on the "player".

### JavaScript
The "player" part is implemented on Node.JS. Not necessary *per se*, just my preference. Important is to have a listener on some machine capable of playing a sound.

Note the server address (to be used for `player_address` in `read_photo.py`) and port defined in `app.listen(3030);`.

Don't forget to execute `npm install` once you have cloned the repo.

## Running

Log to RasPi and start the "player" with `node app.js`.

Telnet to WiPy and start reading the photocells with `import read_photo; read_photo.read()`.

## Thanks
To Adafruit for the [Python tutorial](https://learn.adafruit.com/basic-resistor-sensor-reading-on-raspberry-pi/basic-photocell-reading) and to whomever came up with the idea for Musical Stairs triggered by light sensors :)