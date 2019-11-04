from flask import Blueprint
from tdee_app.models import DailyStats
from tdee_app import db
from tdee_app.data.forms import NewData
from flask import render_template, url_for, flash, redirect, request
from flask_login import current_user, login_required
from datetime import datetime
from flask_graphql import GraphQLView
from tdee_app.models import schema

data = Blueprint('data', __name__)


@data.route('/graphs', methods=["GET", "POST"])
@login_required
def graphs():
    return render_template('graphs.html', title='Graphs')


@data.route('/stats', methods=["GET", "POST"])
@login_required
def stats():
    return render_template('stats.html', title='Stats')



@data.route('/new', methods=["GET", "POST"])
@login_required
def new():
    form = NewData()
    if form.validate_on_submit():
        stats = DailyStats(calories=form.calories.data, weight=form.weight.data, name=current_user, days=(datetime.today().date()-current_user.start_date).days)
        if DailyStats.query.filter_by(date=datetime.today().date(), user_id=current_user.id).first():
            remove_stats = DailyStats.query.filter_by(date=datetime.today().date(), user_id=current_user.id).first()
            db.session.delete(remove_stats)
            flash('Data Updated', 'success')
        else:
            flash('Data Added', 'success')

        db.session.add(stats)
        db.session.commit()
        return redirect(url_for('main.home'))
    elif request.method == 'GET':
        if DailyStats.query.filter_by(date=datetime.today().date(), user_id=current_user.id).first():
            form.calories.data = DailyStats.query\
                .filter_by(date=datetime.today().date(), user_id=current_user.id)\
                .first().calories
            form.weight.data = DailyStats.query\
                .filter_by(date=datetime.today().date(), user_id=current_user.id)\
                .first().weight
            return render_template('new.html', title='New', form=form, text='Update')
    return render_template('new.html', title='New', form=form, text='Add')

data.add_url_rule(
    '/graphql',
    view_func=GraphQLView.as_view(
        'graphql',
        schema=schema,
        graphiql=True # for having the GraphiQL interface
    )
)