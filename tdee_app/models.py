from tdee_app import db
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(15), unique=True, nullable=False)
    password = db.Column(db.String(20), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    start_weight = db.Column(db.Integer, nullable=False)
    current_weight = db.Column(db.Integer, nullable=False)
    stats = db.relationship('Stats', backref='username', lazy=True)

    def __repr__(self):
        return f'User("{self.username}","{self.password}")'

class Stats(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    calories = db.Column(db.Integer())
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
