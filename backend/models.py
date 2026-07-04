from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer,
        primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100),
        unique=True)
    password = db.Column(db.String(200))
    created_at = db.Column(db.DateTime,
        default=datetime.utcnow)

class Account(db.Model):
    id = db.Column(db.Integer,
        primary_key=True)
    user_id = db.Column(db.Integer,
        db.ForeignKey('user.id'))
    account_number = db.Column(
        db.String(20), unique=True)
    balance = db.Column(db.Float,
        default=0.0)
    account_type = db.Column(
        db.String(20), default='savings')

class Transaction(db.Model):
    id = db.Column(db.Integer,
        primary_key=True)
    from_account = db.Column(db.String(20))
    to_account = db.Column(db.String(20))
    amount = db.Column(db.Float)
    type = db.Column(db.String(20))
    description = db.Column(db.String(200))
    timestamp = db.Column(db.DateTime,
        default=datetime.utcnow)