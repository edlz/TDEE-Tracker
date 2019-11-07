from flask_wtf import FlaskForm
from wtforms import SubmitField, IntegerField, DecimalField, DateField
from wtforms.validators import NumberRange, DataRequired

class NewData(FlaskForm):
    calories = IntegerField('Calories Eaten Today', validators=[NumberRange(min=1000)])
    weight = DecimalField('Weight in LB', places=1, validators=[NumberRange(min=100, max=500)])
    submit = SubmitField('Submit Data')

class AddData(FlaskForm):
    date = DateField('Date: m-d-y', format='%m-%d-%Y', validators=[DataRequired()])
    calories = IntegerField('Calories Eaten Today', validators=[NumberRange(min=1000)])
    weight = DecimalField('Weight in LB', places=1, validators=[NumberRange(min=100, max=500)])
    submit = SubmitField('Submit Data')
