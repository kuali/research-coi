INSTRUCTIONS
================

###PREREQUISITES

1. Have [KC Monolith](https://github.com/kuali/kc) up-to-date through at least the October 2015 code release
2. Have core-auth service installed [Insructions Here](https://github.com/kuali/research-coi)

----------
###COI INSTALLION

**Step 1**: download and install [Node.js and npm](https://docs.npmjs.com/getting-started/installing-node)

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
npm install
```
----------
**Step 4**: Create Database
```
create database coi;
```

----------
**Step 5**: Create knexfile.js
```
module.exports = {
  kc_coi: {
    client: 'mysql',
    connection: {
      database: 'coi',
      user: 'root',
      password: ''
    }
  }
};
```
----------

**Step 6**: Apply Migrations:
```
node ~/workspace/kc-coi/node_modules/knex/lib/bin/cli.js --knexfile <replace with knexfile.js path> migrate:latest --env kc_coi
```
----------
**Step 7**: Apply Seed Data:
```
node ~/workspace/kc-coi/node_modules/knex/lib/bin/cli.js --knexfile <replace with knexfile.js path> seed:run --env kc_coi
```

**Step 8**: Install and Configure NGINX:
NGINX is a reverse proxy server that directs client requests to the appropriate back-end server.  In the case of COI it redirects authentication requests to the authentication service's server.
Installation instructions for NGINX can be found [here](https://www.nginx.com/resources/wiki/start/topics/tutorials/install/)

>**Note**: For mac os nginx can be install with homebrew
>```brew install nginx```

Create NGINX config file in *nginxpath*/servers.  An example config file is below.  To use HTTPS an SSL cert and key will need to be provided.

**Example Config**
```
http {
 server {
       listen 443;

       ssl on;
       ssl_certificate <replace with file path to cert>;
       ssl_certificate_key <replace with file path to key>;

       location /coi/ {
           proxy_pass http://<replace with coi host>/coi/;
       }
       location /api/coi/ {
           proxy_pass http://<replace with coi host>/api/coi/;
       }
       location /users/ {
           proxy_pass https://<replace with auth service host>/users/;
       }
       location /api/users/ {
           proxy_pass https://<replace with auth service host>/api/users/;
       }
       location /auth/ {
           proxy_pass https://<replace with auth service host>/auth/;
       }
       location /core-assets/ {
           proxy_pass https://<replace with auth service host>/core-assets/;
       }
   }
}
```

**Step 9**: Configuration Environment Variables:
System configuration for COI is done with environment variables. Environment variables can either be set in the system or added on the command line when starting the application. Below is a list of configuration environment variables


>####**Environment Configuration Variables**
>**AUTHZ_HOST**
>  : The host name for the authorization service end points.  This should be the host name of your KC monolith application.
>  *Default*: uit.kuali.co

>**AUTHZ_ADMIN_ROLE**
> : The role name space and name separated by a colon.
> *Default*:  KC-COIDISCLOSURE:COI%20Administrator

>**DB_HOST**
>: The host name for the database.
>*Default*: localhost

>**DB_USER**
>: The db user name.
>*Default*: root
>
>**DB_PASSWORD**
>: The password for the db user.
>*Default*: none
>
>**DB_NAME**
>:  the name of the database:
>*Default*: coi
>
>**CONNECTION_POOL_SIZE**
>:  the size of the connection pool.
>*Default*: 70
>
>**LOCAL_FILE_DESTINATION**
>:  file system location to store attachments
>*Default*: uploads/
>
>**CACHE_MAX**
>: The maximum number of items in the cache.
>*Default*: 500
>
>**CACHE_MAX_AGE**
>: The maximum age in milliseconds for an item to be valid in the cache.
>*Default*: 60000


**Step 10**: Start Up Node
```
DB_NAME=coi npm start
```

**Step 11**: Navigate to https://<replace with coi host name>/coi