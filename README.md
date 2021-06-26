#### If you do not have USER `testuser` setup in MySQL, follow the below steps to create it:

-   login to mysql as a root user

    ```
    local> mysql -u root -p
    ```

-   create a test user and grant privileges:
    ```
    mysql> CREATE USER 'testuser'@'localhost' IDENTIFIED BY 'password';
    mysql> ALTER USER 'testuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
    mysql> GRANT ALL PRIVILEGES ON * . * TO 'testuser'@'localhost';
    mysql> quit;
    ```

#### prepare the database `tdeedb`

1. Use edited create_db.sql without sales inserts.

    ```
    mysql -u mytestuser -p < create_db.sql
    ```