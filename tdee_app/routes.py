from tdee_app.models import User, Stats
from tdee_app import app
from tdee_app.forms import RegistrationForm, LoginForm
from flask import render_template, url_for, flash, redirect

@app.route('/')
@app.route('/home')
def home():
    return render_template('home.html')

@app.route('/about')
def about():
    return render_template('about.html', title='About')

@app.route('/register', methods=["GET", "POST"])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        flash(f'Account Created For {form.username.data}. Please Login.', category='success')
        return redirect(url_for('login'))
    return render_template('register.html', title='Register', form=form)

@app.route('/login', methods=["GET", "POST"])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        if form.username.data == 'admin' and form.password.data == "password":
            flash('You have been logged in.', 'success')
            return redirect(url_for('home'))
        else:
            flash('Incorrect credentials', 'danger')
    return render_template('login.html', title='Login', form=form)


@app.route('/graphs', methods=["GET", "POST"])
def graphs():
    return render_template('graphs.html', title='Graphs')


@app.route('/stats', methods=["GET", "POST"])
def stats():
    return render_template('stats.html', title='Stats')
