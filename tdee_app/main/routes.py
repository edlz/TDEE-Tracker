from flask import render_template, Blueprint
from tdee_app.models import DailyStats
from flask_login import login_required, current_user
from datetime import datetime
# from tdee_app.calc import calc_tdee
from collections import namedtuple


main = Blueprint('main', __name__)
##########################################################################################################################
cal_conver = 3500
Data =  namedtuple('Data', ['calories', 'weight'])

def list_past_week(day):
    ' takes in day and returns list of data for past 7 days if applicable'
    d = Data([],[])
   
    if day - 6 >= 0:
        for i in range(day - 6, day + 1):
            stats = DailyStats.query.filter_by(days=i, user_id=current_user.id).first()
            if stats:
                d.calories.append(stats.calories)
                d.weight.append(stats.weight)
    else:
        for i in range(day + 1):
            stats = DailyStats.query.filter_by(days=i, user_id=current_user.id).first()
            if stats:
                d.calories.append(stats.calories)
                d.weight.append(stats.weight)
    return d

def list_past_month(day):
    d = Data([],[])
    if day - 30 >= 0:
        for i in range(day - 30, day + 1):
            stats = DailyStats.query.filter_by(days=i, user_id=current_user.id).first()
            if stats:
                d.calories.append(stats.calories)
                d.weight.append(stats.weight)
    else:
        for i in range(day):
            stats = DailyStats.query.filter_by(days=i, user_id=current_user.id).first()
            if stats:
                d.calories.append(stats.calories)
                d.weight.append(stats.weight)
    return d
def get_average_weight_last_week(day):
    d = []
    for i in range(day):
        stats = DailyStats.query.filter_by(days=i-7, user_id=current_user.id).first()
        if stats:
            d.append(stats.weight)
    return sum(d)/len(d)

def tdee_week(d, day):
    ' returns weekly tdee given calories and weight throughout a week '
    if len(d.weight) > 1:
        delta =  get_average_weight_last_week(day) - (sum(d.weight)/len(d.weight))
    else:
        return 0
    tdee = (sum(d.calories)/len(d.calories)) - ((delta * 500 * (day % 7) / len(d.calories)))
    return round(tdee)

def tdee_month(d):
    if len(d.weight) > 1:
        delta = d.weight[-1] - d.weight[0]
    else:
        return 0
    tdee = (sum(d.calories)/len(d.calories)) - ((delta * cal_conver) / len(d.weight))
    return round(tdee)

def this_day_week_tdee(day):
    d = list_past_week(day)
    return str(tdee_week(d, day))

def this_day_month_tdee(day):
    d = list_past_month(day)
    return str(tdee_month(d))

#################################################################################################

@main.route('/')
@main.route('/home')
@login_required
def home():
    data = DailyStats.query\
        .filter_by(user_id=current_user.id)\
        .order_by(DailyStats.date.desc()).all()
    if DailyStats.query.filter_by(date=datetime.today().date(), user_id=current_user.id).first():
        add_text = "Update Today's Data"
    else:
        add_text = 'Add Data'
    return render_template('home.html', datas=data, text=add_text, calc_month=this_day_month_tdee, calc_week=this_day_week_tdee)

@main.route('/about')
def about():
    return render_template('about.html', title='About')