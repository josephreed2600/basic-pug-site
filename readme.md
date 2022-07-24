# What is it

Runtime for throwing together a super simple (think small business or public school) web site that uses Pug.

 1. Copy the docker-compose.yml into a new repo
 1. Make three directories: `views/`, `public/`, `files/`
 1. Put your assets (css, scripts, images) in `public/`
 1. Put your downloadable junk (pdfs and stuff) in `files/`
 1. Put your Pug templates in `views/`
    - The default page when you load `/` is `views/index.pug`
    - Error pages are rendered with `views/error.pug`, see "More magic" for variables
 1. Run with `docker-compose up` or whatever

# More magic

`views/error.pug` can haz two variables:

 - `status` is the status code of the HTTP response
 - `customErr` is a custom message the server would like to share with the user/client. not used as of the first release

The thing serves HTTP on tcp/8080. Use a reverse proxy for TLS and HTTP/2 and forwarding to 80/443, don't do that in the application. Thanks
