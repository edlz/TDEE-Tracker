from flask import render_template, Blueprint
from tdee_app.models import DailyStats
from flask_login import login_required, current_user
from datetime import datetime

main = Blueprint('main', __name__)

@main.route('/')
@main.route('/home')
@login_required
def home():
    data = DailyStats.query\
        .filter_by(user_id=current_user.id)\
        .order_by(DailyStats.date.desc()).all()
    if DailyStats.query.filter_by(date=datetime.today().date(), user_id=current_user.id).first():
        add_text = 'Update Data'
    else:
        add_text = 'Add Data'
    return render_template('home.html', datas=data, text=add_text)

@main.route('/about')
def about():
    return render_template('about.html', title='About')