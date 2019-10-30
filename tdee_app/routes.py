from tdee_app.models import User, Stats
from tdee_app import app, db, bcrypt
from tdee_app.forms import RegistrationForm, LoginForm, UpdateAccountForm
from flask import render_template, url_for, flash, redirect, request
from flask_login import login_user, current_user, logout_user, login_required

@app.route('/')
@app.route('/home')
def home():
    return render_template('home.html')

@app.route('/about')
def about():
    return render_template('about.html', title='About')

@app.route('/register', methods=["GET", "POST"])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    form = RegistrationForm()
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        user = User(username=form.username.data, password=hashed_password)
        db.session.add(user)
        db.session.commit()
        flash(f'Account Created For {form.username.data}. Please Login.', category='success')
        return redirect(url_for('login'))
    return render_template('register.html', title='Register', form=form)

@app.route('/login', methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user and bcrypt.check_password_hash(user.password, form.password.data):
            login_user(user, remember=form.remember.data)
            next_page = request.args.get('next')
            return redirect(next_page) if next_page else redirect(url_for('home'))
        else:
            flash('Incorrect credentials', 'danger')
    return render_template('login.html', title='Login', form=form)

@app.route('/logout', methods=["GET", "POST"])
def logout():
    logout_user()
    return redirect(url_for('home'))

@app.route('/graphs', methods=["GET", "POST"])
@login_required
def graphs():
    return render_template('graphs.html', title='Graphs')


@app.route('/stats', methods=["GET", "POST"])
@login_required
def stats():
    return render_template('stats.html', title='Stats')

@app.route('/profile', methods=["GET", "POST"])
@login_required
def profile():
    form = UpdateAccountForm()
    if form.validate_on_submit():
        current_user.username = form.username.data
        current_user.Stats.start_date = form.start_date.data
        current_user.Stats.start_weight = form.start_weight.data
        db.session.commit()
        flash('Account Updated.', 'success')
        return redirect(url_for('account'))
    elif request.method == 'GET':
        form.username.data = current_user.username
        start_weight = current_user.start_weight
    return render_template('profile.html', title='Profile', form=form)
