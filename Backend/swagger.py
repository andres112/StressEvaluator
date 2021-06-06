from flask_swagger_ui import get_swaggerui_blueprint

# swagger details for documentation
SWAGGER_URL = '/swagger'
API_URL = '/static/swagger.json'
SWAGGERUI_BLUEPRINT = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={
        'app_name': "Stressor Test Platform API"
    }
)
