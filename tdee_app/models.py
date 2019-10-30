from tdee_app import db, login_manager
from datetime import datetime
from flask_login import UserMixin

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(15), unique=True, nullable=False)
    password = db.Column(db.String(20), nullable=False)
    start_date = db.Column(db.Date, nullable=False, default=datetime.today().date())
    start_weight = db.Column(db.Integer, nullable=False, default=0)

    daily_stats = db.relationship('DailyStats', backref='name', lazy=True)

    def __repr__(self):
        return f'User("{self.username}","{self.start_date}")'

class DailyStats(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    calories = db.Column(db.Integer())
    weight = db.Column(db.Integer())
    date = db.Column(db.Date, nullable=False, default=datetime.today().date())
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f'DailyStats("{self.calories}","{self.date}")'