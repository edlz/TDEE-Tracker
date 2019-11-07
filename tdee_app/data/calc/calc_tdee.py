
cal_conver = 3500


def average_weekly(data):
    ' receives list of calories eaten in the week, returns average calories eaten in a day '
    return (sum(data)/len(data))


def tdee_month(data):

    return 

def tdee_week(data):
    ' returns weekly tdee given calories and weight throughout a week '
    delta = start_weight - end_weight
    tdee = average_weekly(list_of_calories) - ((delta * cal_conver) / 7)

    return tdee
