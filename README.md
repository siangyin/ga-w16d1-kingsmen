[![General Assembly Logo](https://camo.githubusercontent.com/1a91b05b8f4d44b5bbfb83abac2b0996d8e26c92/687474703a2f2f692e696d6775722e636f6d2f6b6538555354712e706e67)](https://generalassemb.ly)

# Kingsman: The Secret Service

---

Title: Kingsman - The Secret Service<br>
Type: Homework<br>
Creator: Jerrica Bobadilla<br>
Competencies: Express app with sessions and authentication

---

![](https://imgur.com/UILh3pk.png)

> You've been hired to run the Kingsman Tailor Shop website. To normal, logged out, citizens, the site should appear like a normal website. But to the logged in secret agents, the site should give them access to the secret Fitting Room Three page. There, they should be able to post messages to each other.

## Activity

The Kingsman site is still under heavy construction and not yet open to the public, so your main task for now is to just get the sessions and authentication working so that the Fitting Room Three page is only accesible by logged in users.

### Set Up

- Make sure to pull to get the starter code provided for you in the `kingsman_auth` folder
  - Read through all the provided code and make sure you understand what's going on
  - We've organized the files using MVC file structure, make sure you understand what goes where and why
- Don't forget to `npm i` before getting started to install all the dependencies
- Get your app up and running with `nodemon` and `mongod`
  - Remember order matters! In what order should you run those commands?
  - Check the `server.js` file to see what your mongo database will be named

### Creating Users

First things first, we need to be able to create accounts for our agents. Below are the steps required, but not necessarily in order. Read through them and decide what workflow makes the most sense to you! For example, can you create a 'create new user' route without having a user model set up yet? Need help on the workflow? look back at the build notes from this afternoon!

- Create a Users controller in the `controllers` folder
  - The controller should have routes...
    - to get to `users/new`
    - to create a new user
  - Don't forget to `require` and `app.use` your users controller in `server.js`
- Create a User model in the `models` folder
  - Your User schema should have...
    - name: string
    - password: string
    - messages: array of strings
  - Once you've created the User model, uncomment out the require in `controllers/room.js` (should be around line 4)
  - Require the User model in `server.js`
- In the `views` folder, make a subfolder named `users`
- Create a `new.ejs` file inside the new `views/users` folder
  - This file should have a form to create new users
- On the `views/index.ejs` page, add a link `Create a New User` that takes the user to `/users/new`

:red_circle: **Commits:**

> Commit at least once for each section -- you decide your commit messages!

### Creating Sessions

Now that we can create accounts, we have to create sessions so that only logged in agents can enter Fitting Room 3

- Remember that we need to install the npm package `express-session` to use sessions with our app
  - After installing it, require it in your `server.js`: `const session = require('express-session')`
  - Don't forget the middleware needed to use it
    ```
    app.use(session({
      secret: "feedmeseymour", //some random string
      resave: false,
      saveUninitialized: false
    }));
    ```
- Create a Sessions controller in the `controllers` folder
  - The controller should have routes...
    - to get to `sessions/new`
    - to create a new session
    - to delete a session
      - _Think:_ we need to install an npm package for this, what package is it? don't forget to require and use it!
  - Don't forget to `require` and `app.use` your session controller in `server.js`
- Create a `new.ejs` file for logging in/creating a new session in the `views` folder
  - _Think:_ should you make it directly in the views folder, or should there be a subfolder first?
  - This file should have a form to log in
- In the `views/index.ejs` file, add a link to the log in page, and then a button to log out that shows _only if_ a user is logged in
- Remember! Make sure you add a user to a session when they log in
  - _Hint:_ you might write something somewhat similar to this in your new session route: `req.session.currentUser = foundUser;`

:red_circle: **Commits:**

> Commit at least once for each section -- you decide your commit messages!

### Encrypting Passwords

Nice work, now we have working users and sessions! But, Fitting Room Three holds classified information, so we want to be as secure as possible. Let's encrypt all our agent's passwords

- We need to install the `bcrypt` package
  - Require it on `controllers/users.js` and `controllers/sessions.js`
- Update your create a new user route on `controllers/users.js` so that it uses bcrypt to encrypt their password
- Update your create a new session route on `controllers/sessions.js` so that it uses bcrypt to compare passwords and allow login

:red_circle: **Commits:**

> You decide your commit messages!

### Seeding Kingsman Data

Only the Kingsman Agents should have user accounts. We don't want any regular citizen to be able to enter Fitting Room Three, after all.

- Now that you've tested that creating users works and encrypts their passwords, get rid of the Create a New User link on our `views/index.ejs`
- Thus, unless a citizen somehow stumbles upon the `users/new` page, they shouldn't be able to create a new user
  - :footprints: **Stretch Goal:** Rather than just deleting the Create a New User link, make it so that only logged in users can see the link
  - :footprints: **Stretch Goal 2:** Make it so that even if a logged out citizen stumbled upon the `users/new` page, they are unable to actually see the create new user form or get to the page at all

Now, we need to create the Kingsman Agent's accounts.

- We've provided you with a seed in the `models/seed.js` file, and connected it in the `server.js` file
  - Take a look at the seed code in the `server.js` file and figure out what route you need to visit in the browser to seed your database
  - _Remember:_ You only need to visit the seed route **once**!
- Check to make sure you've seeded successfully by trying to log in with username `merlin` and password `countryroads`

:red_circle: **Commit:**

> You decide your commit messages!

### Accessing Fitting Room 3

Now that we have sessions working and our agents have their usernames and passwords -- we can finally work on making Fitting Room 3 an agent-exclusive page.

- Look at your index `localhost:3000` while logged out. You should still be able to see the link to Fitting Room 3, so let's change that!
  - Update `views/index.ejs` so that the Fitting Room 3 link only shows if a user is logged in
  - :footprints: **Stretch Goal:** Make it so that if a logged out user goes to `localhost:3000/room` at all, they are redirected to the log in page
- Sweet, now only agents can enter the fitting room and see the secret messages!
  - :footprints: **Stretch Goal 2:** Make it so that when a user posts a new message, it shows their username along with the message so that other agents know who posted what

## Hungry for More?

- Do all the stretch goals listed throughout the homework
- Start this all from scratch without using the starter code to practice making a full CRUD app with sessions/authentication
- Style the app! Expand on the given starter CSS/HTML, make your own from scratch, or use a framework like Bootstrap
- Try using ejs partials
