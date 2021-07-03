DROP DATABASE IF EXISTS tdeedb;
CREATE DATABASE tdeedb;
USE tdeedb;

CREATE TABLE users (
	id INTEGER NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(60) NOT NULL,
    created DATETIME NOT NULL,
    start_date DATE NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE weights (
    userId INTEGER NOT NULL,
    weightLB FLOAT NOT NULL,
    entryDate DATE NOT NULL,
    day INTEGER NOT NULL,
    FOREIGN KEY (userId) REFERENCES users (id)
);

CREATE TABLE calories (
    userId INTEGER NOT NULL,
    calories INTEGER,
    entryDate DATE,
    day INTEGER NOT NULL,
    FOREIGN KEY (userId) REFERENCES users (id)
);

CREATE TABLE goals (
    userId INTEGER NOT NULL,
    goal_weight FLOAT,
    calorie_deficit INTEGER,
    FOREIGN KEY (userId) REFERENCES users (id)
);

CREATE TABLE weekly_tdee(
    userId INTEGER NOT NULL,
    tdee INTEGER NOT NULL,
    week INTEGER NOT NULL,
    FOREIGN KEY (userId) REFERENCES users (id)
);