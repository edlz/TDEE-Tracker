## Total Daily Energy Expenditure Tracker

Your TDEE is the number of calories you burn per day. This app calculates your TDEE given calories and weight.

To get a accurate TDEE number, it is recommended you track your calories using an app like `MyFitnessPal` and input the number of calories and your weight at the end of the day.

### Images

![Homepage](/client/src/img/homepage.jpg)
![Graphs](/client/src/img/graphs.jpg)

## To run locally...

### 1. Clone the repository

```
git clone https://github.com/ez0623/TDEE-Tracker.git
```

### 2. Install dependencies

```
cd ./TDEE-Tracker
npm install
cd ./client
npm install
```

### 3. Setup the MYSQL Database

1. Run the `./mysql-commands/create_db.sql` with the following command to setup the database.

   ```
   mysql -u testuser -p < create_db.sql
   ```

2. If you do not have USER `testuser` setup in MySQL, follow the below steps to create it:

   - login to mysql as a root user

     ```
     local> mysql -u root -p
     ```

   - create `testuser` with password as `password` and grant privileges:
     ```
     mysql> CREATE USER 'testuser'@'localhost' IDENTIFIED BY 'password';
     mysql> ALTER USER 'testuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
     mysql> GRANT ALL PRIVILEGES ON * . * TO 'testuser'@'localhost';
     mysql> quit;
     ```

   3. Ensure credentials in `/src/db/connections.js` matches the user created

   ```
   const pool = mysql.createPool({
       connectionLimit: 10,
       host: "localhost",
       user: "testuser",
       password: "password",
       database: "tdeedb",
       timezone: "UTC",
   });
   ```

### 4. Run the app

```
npm run dev
```

## Testing

#### Run Mocha tests to ensure app and mysql database is working properly.

```
npm run test
```
