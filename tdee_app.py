from flask import Flask, render_template, url_for, flash, redirect
from forms import RegistrationForm, LoginForm
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = '7e383cd41ecd1c5dbbe4f8279dc2611f'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(15), unique=True, nullable=False)
    password = db.Column(db.String(20), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    start_weight = db.Column(db.Integer, nullable=False)
    current_weight = db.Column(db.Integer, nullable=False)
    stats = db.relationship('Stat', backref='username', lazy=True)

    def __repr__(self):
        return f'User("{self.username}","{self.password}")'

class Stat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    calories = db.Column(db.Integer())
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    


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

if __name__ == '__main__':
    app.run(debug=True)