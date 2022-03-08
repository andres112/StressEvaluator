import argparse
import ipaddress
import os
import time

import discoverhue
import pygame
from flask import Flask, request, make_response, jsonify
from flask_cors import CORS
from phue import Bridge
from nanoleafapi import Nanoleaf
from NanoLeafDiscovery import nano

from helpers import *

app = Flask(__name__)

pygame.init()
pygame.mixer.init()

dock = None
bridge = None


################################################################################
# Important Note: create a music folder in root, add mp3 files for music control


@app.route('/discover_bridge', methods=['GET'])
def discover():
    try:
        if request.method == 'GET':
            # Phillips Hue lights
            hue_found = discoverhue.find_bridges()
            for bridge in hue_found:
                print(' Phillips Bridge ID {br} at {ip}'.format(br=bridge, ip=hue_found[bridge]))

            # Nanoleaft lights
            nl_found = nano.discover(_id=True)
            for d in nl_found:
                print(' Nanoleaf Dock ID {dock} at {ip}'.format(dock=d['id'], ip=d['ip']))

            return make_response(jsonify({'phillips': hue_found, 'nanoleaf': nl_found}), 200)
    except Exception as e:
        print(e)


@app.route('/connect_lights', methods=['POST'])
def connect():
    try:
        # Validate if valid ip_address
        ipaddress.ip_address(request.json['dock_ip'])
        ipaddress.ip_address(request.json['bridge_ip'])
        if request.method == 'POST':
            # Create Bridge object. For the first time is required to push the Phillips Bridge's power button
            global bridge
            bridge = Bridge(request.json['bridge_ip'])
            bridge.connect()

            # Create Dock object. For the first time is required to push the Nanoleaf Dock's power button
            global dock
            dock = Nanoleaf(request.json['dock_ip'])

            return make_response(jsonify({'message': 'dock_connected'}), 200)
    except ValueError:
        print(f"IP address not valid, please check them")
    except Exception as e:
        print(e)


@app.route('/control_lights', methods=['POST'])
def control():
    try:
        if request.method == 'POST':
            print(f"Command received: {request.json}")
            start_time = time.time()

            current_status = bridge.get_group('lab')['state']['any_on']

            # Light parameters command
            [r, g, b] = request.json['rgb'] \
                if ('rgb' in request.json and request.json['rgb'] is not None) \
                else [255, 255, 255]
            on = request.json['on'] if ('on' in request.json and request.json['on'] is not None) else None
            lights = request.json['lights'] \
                if ('lights' in request.json and request.json['lights'] is not None) \
                else [1, 2, 3]
            light_ids = [int(light) for light in lights]  # get the light_id in int format

            # Get the ambient light in lux, if nothing comes assign the value for a standard office 300 to 500 lux
            lux = int(request.json['ambient']['light']) if (
                    'ambient' in request.json and type(request.json['ambient']) is not bool) else MAX_LUX

            # Adapt the color bright to ambient light, linear bright behavior
            [r, g, b] = adaptBright(r, g, b, lux, 0)
            command = rgbTohue(r, g, b)
            if on is not None and current_status != on:
                command['on'] = on

            # execute commands in lights
            bridge.set_light(light_ids, command, transitiontime=0)
            print(f"Philips: Command executed in {time.time() - start_time} sec.")

            # Get the status after change
            print("Phillips Hue state:")
            print(bridge.get_api())

            return make_response(jsonify({'message': 'command executed successfully'}), 200)
    except Exception as e:
        print(e)


@app.route('/control_nanoleaf', methods=['POST'])
def control_nano():
    try:
        if request.method == 'POST':
            start_time = time.time()
            [r, g, b] = request.json['rgb'] \
                if ('rgb' in request.json and request.json['rgb'] is not None) \
                else [255, 255, 255]
            on = request.json['on'] if ('on' in request.json and request.json['on'] is not None) else None
            # Get the ambient light in lux, if nothing comes assign the value for a standard office 300 to 500 lux
            lux = int(request.json['ambient']['light']) if (
                    'ambient' in request.json and type(request.json['ambient']) is not bool) else MAX_LUX

            # Validate if nanoleaf is on
            power = dock.get_power()
            # execute command
            if on or (power and on is None):
                # Adapt the color bright to ambient light, linear bright behavior
                [r, g, b] = adaptBright(r, g, b, lux, 0)
                dock.set_color((r, g, b))
            else:
                dock.power_off()
            print(f"Nanoleaf: Command executed in {time.time() - start_time} sec.")

            print("Nanoleaf state:")
            print(dock.get_info()['state'])  # Get the status after change

            return make_response(jsonify({'message': 'command executed successfully'}), 200)
    except Exception as e:
        print(e)


@app.route('/control_music/<action>', methods=['POST'])
def music(action):
    try:
        path = "./music/"
        track_list = os.listdir(path)
        if request.method == 'POST':
            params = {'time': (request.json['time'] * 1000) if 'time' in request.json else -1,
                      'song': f"{request.json['song_id']}" if (
                              'song_id' in request.json and f"{request.json['song_id']}" in track_list) else "245.mp3"}
            pygame.mixer.music.set_volume(0) if action == "stop" else pygame.mixer.music.set_volume(0.8)
            song_path = path + params['song']
            pygame.mixer.music.load(str(song_path))
            if action == "stop":
                pygame.mixer.music.stop()
            elif action == "play":
                pygame.mixer.music.play(loops=-1, fade_ms=3000)
                start = pygame.time.get_ticks()

            while pygame.mixer.music.get_busy():
                time_ongoin = pygame.time.get_ticks() - start
                if 0 < params['time'] <= time_ongoin:
                    print(time_ongoin)
                    pygame.mixer.music.stop()

            return make_response(jsonify({'message': 'command executed successfully'}), 200)

    except Exception as e:
        print(e)


if __name__ == '__main__':
    PARSER = argparse.ArgumentParser(description="Phillips hue lights and music control")
    PARSER.add_argument('--debug', action='store_true',
                        help="Use flask debug/dev mode with file change reloading")
    ARGS = PARSER.parse_args()

    PORT = 5555

    # cross origen support
    CORS(app)

    if ARGS.debug:
        print("Running in debug mode")
        app.run(host='0.0.0.0', port=PORT, debug=True)
    else:
        app.run(host='0.0.0.0', port=PORT, debug=False)
