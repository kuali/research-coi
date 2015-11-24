INSTRUCTIONS
================

**Step 1**: download and install [Node.js and npm](https://docs.npmjs.com/getting-started/installing-node)
```
Current version in use: 0.12.4
You may want to install nvm (Node Version Manager) to make it
easy to switch versions.
```
----------
**Step 2**: clone [research-coi project](https://github.com/kuali/research-coi)
```
cd ~/workspace
git clone https://github.com/kuali/research-coi research-coi
```
----------
**Step 3**: install dependecies
```
cd ~/workspace/research-coi
```
edit package.json and remove either mysql or strong-oracle from dependencies
<br><br>
if using strong-oracle go through the install process listed for [strong-oracle](https://github.com/strongloop/strong-oracle), including drivers.
```
npm install

```
----------
**Step 4**: Create Database
mysql
```
create database coi;
```
or oracle
```
CREATE USER coi IDENTIFIED BY "&pw";
grant create session to coidemo;
grant create procedure to coidemo;
grant create table to coidemo;
grant create sequence to coidemo;
create tablespace coi ....
alter user coi default tablespace coi;
```

----------
**Step 5**: Create knexfile.js
mysql
```
module.exports = {
  kc_coi: {
    client: 'mysql',
    connection: {
      database: 'coi',
      user: 'root',
      password: ''
    }
  },
  pool: {
    min: 2,
    max: 20
  }
};
```
OR oracle
```
module.exports = {
  kc_coi: {
    client: 'strong-oracle',
    connection: {
      database: '<sid>',
      host: '<host name or ip>',
      port: '1521',
      user: 'COI',
      password: `<password>'
    }
  }
};

```
----------

**Step 6**: Apply Migrations:
```
node ~/workspace/kc-coi/node_modules/knex/lib/bin/cli.js --cwd=db/migration --knexfile <replace with knexfile.js path> migrate:latest --env kc_coi
```
----------
**Step 7**: Apply Seed Data:
```
node ~/workspace/kc-coi/node_modules/knex/lib/bin/cli.js --cwd=db/migration --knexfile <replace with knexfile.js path> seed:run --env kc_coi
```
**Step 8**: Configuration Environment Variables:

System configuration for COI is done with environment variables. Environment variables can either be set in the system or added on the command line when starting the application. Below is a list of configuration environment variables

>####**Environment Configuration Variables**

>**COI_PORT**
>: port for the coi app.
>*Default*: 8090

>**DB_PACKAGE**
>: The node db package to use
>*Default*: strong-oracle

>**DB_HOST**
>: The host name for the database.
>*Default*: localhost

>**DB_PORT**
>: The port for the database.
>*Default*: none

>**DB_USER**
>: The db user name.
>*Default*: root
>
>**DB_PASSWORD**
>: The password for the db user.
>*Default*: none
>
>**DB_NAME**
>:  the name of the database.
>*Default*: coi
>
>**CONNECTION_POOL_SIZE**
>:  the size of the connection pool.
>*Default*: 70
>
>**LOCAL_FILE_DESTINATION**
>:  file system location to store attachments
>*Default*: uploads/

-------

>###**Auth Service**
>
>Out of the box our reference implementation of the Kuali Core Auth Service is turned off. Please contact Kuali Core Team to find out more about the Auth Service.
>
>A mock auth service has been provided out of the box.  Any username starting with an "a" will be given the admin role, any other name will be given the user role.  Users p1 through p500 have been populated with demo data.
>
>Configuration variables to enable the auth service are below.
>
>**AUTH_ENABLED**
>: flag as true if you have an auth service instance you can work with, if not present or false app will use a mock auth service.
>*Default*: false
>
>**CACHE_MAX**
>: The maximum number of items in the cache. Used by the auth service.
>*Default*: 500
>
>**CACHE_MAX_AGE**
>: The maximum age in milliseconds for an item to be valid in the cache. Used by the auth service.
>*Default*: 60000
>
>**AUTHZ_HOST**
>  : The host name for the authorization service end points.  This should be the host name of your KC monolith application.
>  *Default*: uit.kuali.co

>**AUTHZ_ADMIN_ROLE**
> : The role name space and name separated by a colon.
> *Default*:  KC-COIDISCLOSURE:COI%20Administrator

**Step 9**: Run Webpack
```
./node_modules/.bin/webpack
```

**Step 10**: Start Up Node
```
DB_NAME=coi node server/bootstrap
```

**Step 11**: Navigate to hostname:port/coi/
