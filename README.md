"# fullstackopen" 

This branch (notes-app) is where the code-along is to be recorded for the Full Stack Open Course available at:
https://fullstackopen.com/en/about


To build production version of app, go to root of web app (/code) and run:

    npm run build

Then, from /code, you can copy over the /build directory into your /backend folder like so:

    cp -r /build ../backend

Don't forget to use static middleware in your Express server!

    server.use(express.static('build'));

