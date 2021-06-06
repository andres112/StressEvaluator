import argparse
import os
from flask import Flask
from flask_cors import CORS
from pathlib import Path
from swagger import SWAGGERUI_BLUEPRINT, SWAGGER_URL
from routes import endpoint

app = Flask(__name__)

# Blueprint for documentation with swagger
app.register_blueprint(SWAGGERUI_BLUEPRINT, url_prefix=SWAGGER_URL)

# Routes Blueprint
app.register_blueprint(endpoint, url_prefix='')

# Main execution
if __name__ == '__main__':
    PARSER = argparse.ArgumentParser(description="Stressor Test Platform API")
    PARSER.add_argument('--debug', action='store_true',
                        help="Use flask debug/dev mode with file change reloading")
    ARGS = PARSER.parse_args()

    PORT = os.getenv('PORT')

    if ARGS.debug:
        print("Running in debug mode")
        # cross origen support
        CORS(app)
        app.run(host='0.0.0.0', port=PORT, debug=True)
    else:
        app.run(host='0.0.0.0', port=PORT, debug=False)
