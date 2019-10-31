from flask_wtf import FlaskForm
from wtforms import SubmitField, IntegerField, DecimalField
from wtforms.validators import NumberRange

class NewData(FlaskForm):
    calories = IntegerField('Calories Eaten Today', validators=[NumberRange(min=1000)])
    weight = DecimalField('Weight in LB', places=1, validators=[NumberRange(min=100, max=500)])
    submit = SubmitField('Submit Data')