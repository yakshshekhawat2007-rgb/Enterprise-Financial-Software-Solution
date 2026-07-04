from flask import Flask
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from models import db

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = \
    'sqlite:///banking.db'
app.config['JWT_SECRET_KEY'] = \
    'supersecretkey123'

db.init_app(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
CORS(app)

from routes.auth import auth_bp
from routes.accounts import accounts_bp
from routes.transactions import trans_bp

app.register_blueprint(auth_bp)
app.register_blueprint(accounts_bp)
app.register_blueprint(trans_bp)

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)