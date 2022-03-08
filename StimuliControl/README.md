# Stimuli Control

### As a part of **The effect of music and colored light on stress in occupational health** project.

## Tools (requirements.txt)
- python v 3.x 
- Flask
### Libraries
- discoverhue
- phue
- pygame
- nanoleafapi
- NanoLeafDiscovery

## Set up

__Clone the Project__

In your local machine execute the following: 

    git clone https://github.com/andres112/StressEvaluator.git

    cd .\mt_stress_detection\StimuliControl\

Install dependencies included in __requirements.txt__ file

    pip install -r requirements.txt

## Implementation

After the configuration is correct, in the same directory execute:

    python app.py

## Devices setup

- Please go to nanoleaf api documentation https://pypi.org/project/nanoleafapi/ to configure the panels correctly
- Please go to phue repository documentation https://github.com/studioimaginaire/phue to configure the Philips Hue devices
- The Headphones doesn't require special configuration but please go to https://github.com/pygame/pygame for documentation