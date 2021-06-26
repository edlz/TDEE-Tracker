DROP DATABASE IF EXISTS tdeedb;
CREATE DATABASE tdeedb;
USE tdeedb;

CREATE TABLE users (
	id INTEGER NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(20) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE weights (
    userId INTEGER NOT NULL,
    weightLB FLOAT NOT NULL,
    weightDate DATE NOT NULL,
    FOREIGN KEY (userId) REFERENCES users (id)
);

CREATE TABLE daily_tdee (
    userId INTEGER NOT NULL,
    FOREIGN KEY (userId) REFERENCES users (id)
);