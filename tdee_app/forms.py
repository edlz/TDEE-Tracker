from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, BooleanField, IntegerField, DateField
from wtforms.validators import DataRequired, Length, EqualTo, ValidationError, NumberRange
from tdee_app.models import User
from flask_login import current_user

class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=3, max=15)])
    start_weight = IntegerField('Starting Weight in LB' , validators=[DataRequired(), NumberRange(min=50)])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=3, max=20)])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Create Account')

    def validate_username(self, username):
        user= User.query.filter_by(username=username.data).first()
        if user:
            raise ValidationError('Username taken')

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=3, max=15)])
    password = PasswordField('Password', validators=[DataRequired()])
    remember = BooleanField('Remember Me')
    submit = SubmitField('Log In')

class UpdateAccountForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=3, max=15)])
    start_date = DateField('Starting Date', format='%m-%d-%Y')
    start_weight = IntegerField('Starting Weight in LB', validators=[NumberRange(min=50)])
    submit = SubmitField('Update Profile')

    def validate_username(self, username):
        if username.data != current_user.username:
            user= User.query.filter_by(username=username.data).first()
            if user:
                raise ValidationError('Username taken')

class NewData(FlaskForm):
    calories = IntegerField('Calories Eaten Today', validators=[NumberRange(min=1000)])
    weight = IntegerField('Weight in LB', validators=[NumberRange(min=50)])
    submit = SubmitField('Submit Data')
