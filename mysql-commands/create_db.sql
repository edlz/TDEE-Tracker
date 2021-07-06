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

CREATE TABLE data_entry (
    userId INTEGER NOT NULL,
    weight FLOAT,
    calories INTEGER,
    entryDate DATE NOT NULL,
    day INTEGER NOT NULL,
    FOREIGN KEY (userId) REFERENCES users (id)
);


CREATE TABLE goals (
    userId INTEGER NOT NULL,
    goal_weight FLOAT,
    calorie_deficit INTEGER,
    FOREIGN KEY (userId) REFERENCES users (id)
);
