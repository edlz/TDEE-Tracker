from flask import Blueprint, render_template, url_for, flash, redirect, request
from tdee_app.models import DailyStats, schema
from tdee_app import db
from tdee_app.data.forms import NewData, AddData
from flask_login import current_user, login_required
from flask_graphql import GraphQLView
from datetime import datetime

data = Blueprint('data', __name__)

@data.route('/graphs', methods=["GET", "POST"])
@login_required
def graphs():
    bar_labels=labels
    bar_values=values
    return render_template('graphs.html', title='Graphs', max=17000, labels=bar_labels, values=bar_values)

@data.route('/stats', methods=["GET", "POST"])
@login_required
def stats():
    return render_template('stats.html', title='Stats')


# add data to current date
@data.route('/new', methods=["GET", "POST"])
@login_required
def new():
    form = NewData()
    if form.validate_on_submit():
        stats = DailyStats(calories=form.calories.data, weight=form.weight.data, name=current_user, date=datetime.today().date(), days=(datetime.today().date()-current_user.start_date).days)
        # check if data already exists for current day
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

# add data to past days
@data.route('/add', methods=["GET", "POST"])
@login_required
def add_data():
    form = AddData()
    if form.validate_on_submit():
        # date_conver = datetime.strptime(form.date.data, '%Y-%m-%d')
        stats = DailyStats(calories=form.calories.data, weight=form.weight.data, name=current_user, date=form.date.data, days=(form.date.data-current_user.start_date).days)
        # removes the previous stats for day if data for day already exists
        # patched out
        if DailyStats.query.filter_by(date=form.date.data, user_id=current_user.id).first():
            remove_stats = DailyStats.query.filter_by(date = form.date.data, user_id=current_user.id).first()
            db.session.delete(remove_stats)
            flash('Data Updated', 'success')
        else:
            flash(f'Data Added for day {stats.days}, ', 'success')
        db.session.add(stats)
        db.session.commit()
        return redirect(url_for('main.home'))
  
    return render_template('add.html', title='Add Data', form=form, text='Add')

@data.route('/<int:data_id>/delete', methods=['POST'])
@login_required
def delete_data(data_id):
    data = DailyStats.query.get_or_404(data_id)
    if data.name != current_user:
        abort(403)
    db.session.delete(data)
    db.session.commit()
    flash(f'Data for date {data.date} deleted.', 'danger')
    return redirect(url_for('main.home'))

    
    
# graphql
data.add_url_rule(
    '/graphql',
    view_func=GraphQLView.as_view(
        'graphql',
        schema=schema,
        graphiql=True # for having the GraphiQL interface
    )
)

