from flask import Blueprint, request, jsonify
from flask_jwt_extended import \
    create_access_token
import random

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    from app import db, bcrypt
    from models import User, Account
    data = request.json
    if User.query.filter_by(
        email=data['email']).first():
        return jsonify({
            'error': 'Email exists!'
        }), 400
    hashed = bcrypt.generate_password_hash(
        data['password']).decode('utf-8')
    user = User(
        name=data['name'],
        email=data['email'],
        password=hashed)
    db.session.add(user)
    db.session.flush()
    acc_number = str(random.randint(
        1000000000, 9999999999))
    account = Account(
        user_id=user.id,
        account_number=acc_number,
        balance=1000.0)
    db.session.add(account)
    db.session.commit()
    return jsonify({
        'message': 'Account created!',
        'account_number': acc_number})

@auth_bp.route('/login', methods=['POST'])
def login():
    from app import bcrypt
    from models import User
    data = request.json
    user = User.query.filter_by(
        email=data['email']).first()
    if not user or \
        not bcrypt.check_password_hash(
        user.password, data['password']):
        return jsonify({
            'error': 'Wrong credentials!'
        }), 401
    token = create_access_token(
        identity=str(user.id))
    return jsonify({
        'token': token,
        'name': user.name})