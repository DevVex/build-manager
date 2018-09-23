# build-manager

## Prerequisites

Make sure NVM, Angular 2.* and MongoDB are installed. MongoDB needs to be listening on default port (27017) or change [this](https://github.com/DevVex/build-manager/blob/master/app.js#L9) to point to db before setup.

## Setup

`nvm install`

`nvm use`

`npm start`

This will build and install the Frontend and Backend and listen on port 3000

Run with pm2

`pm2 start npm -- start`

Monitor running pm2 instances

`pm2 monit`



# REST API

/api/version
* [GET] returns name and version of the app

/api/builds
* [GET] returns all builds (array)

/api/read 
* [GET] params:  bundle_id  (string)     
return:if  bundle_id  exists
            build  number  (int)else 4xx/

/api/set  
* [POST] params: bundle_id  (string)     new_build_number  (int) biz  logic if  bundle_id  does  not  exist. create  and  init  build_number  =  0; If  new_build_number  >    existing_build_number existing_build_number  =  new_build_number 
return:success:  200 else:  4xx 

/api/bump  
* [POST] params:  bundle_id  (string) biz  logic if  bundle_id  does  not  exist. create  and  init  build_number  =  0; build_number++
return build_number  (int)