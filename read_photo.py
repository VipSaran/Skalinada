from machine import Pin
import time
import socket

# Based on:
# https://learn.adafruit.com/basic-resistor-sensor-reading-on-raspberry-pi/basic-photocell-reading


class Photocell(object):

    def __init__(self, gpio=None, tone=None, pin=None):
        self.gpio = gpio
        self.tone = tone
        self.pin = pin

cells = []
cells.append(Photocell('GP4', 'a'))
cells.append(Photocell('GP0', 'b'))
cells.append(Photocell('GP3', 'c'))
cells.append(Photocell('GP31', 'd'))
cells.append(Photocell('GP30', 'e'))

player_address = '192.168.2.110'
player_port = 3030

DARK = 0
DARK_ACCUMULATED = 1000
DELAY = 500


def sendRequest(tone):
    # print('sendRequest(), ' + tone)
    s = socket.socket()
    addr = socket.getaddrinfo(player_address, player_port)[0][4]
    # print("Connect address:", addr)
    s.connect(addr)
    s.send(b'GET /play/' + tone + ' HTTP/1.0\n\n')
    print(s.recv(4096))
    s.close()


def RCtime():
    for cell in cells:
        cell.pin = Pin(cell.gpio, mode=Pin.IN, pull=Pin.PULL_DOWN)
    time.sleep_ms(100)

    for cell in cells:
        dark_duration = 0
        while (cell.pin.value() == DARK):
            dark_duration += 1
            if dark_duration > DARK_ACCUMULATED:
                sendRequest(cell.tone)
                time.sleep_ms(DELAY)
                dark_duration = 0


def read():
    # print('read()')
    while True:
        RCtime()


if __name__ == '__main__':
    # print('init')
    read()
