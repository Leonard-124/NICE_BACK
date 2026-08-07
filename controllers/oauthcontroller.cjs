// const express = require("express")
// const passport = require("passport")
// const GoogleStategy = require('passport-google-oauth20').Strategy
// const session = require("express-session")
// require('dotenv').config()

// const app = express()


// //Configure session for OAuth 2.0
// app.use(session({
//     secret: process.env.SECRET_KEY,
//     resave: false,
//     saveUninitialized: false,
//     cookie: { secure: process.env.NODE_ENV === 'production'}
// }))

// //Initialize Passport
// app.use(passport.initialize());
// app.use(passport.session)

// //Configure Google OAuth 2.0 Strategy
// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clentSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: process.env.CALLBACK_URL //'http://localhost:8080/auth/google/callback'
// },
// (accessToken, refreshToken, profile, done) => {
//     //In a real app, you'd find or create a user in your database
//     const user = {
//         id: profile.id,
//         displayName: profile.displayName,
//         provider: 'google'
//     };

//     return done(null, user)
// }
// ));


// //Serialize user for session
// passport.serializeUser((user, done) => {
//     done(null, user);
// })

// //Deserialize user from session
// passport.deserializeUser((user, done) => {
//     done(null, user)
// });

// //Routes for Google OAuth
// app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email']}));

// app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login'})
// (req, res) => {
//     // Successful authentication
//     res.redirect('/profile')
// }
// );

// //Middleware to check authentication
// const isAuthenticated = (req, res, next) => {
//     if (req.isAuthenticated()) {
//         return next()
//     }
//     res.redirect("/login");
// };

// //Protected route
// app.get("/profile", isAuthenticated, (req, res) => {
//     res.json({user: req.user });
// })

// //Logout route
// app.get("/logout", (req, res) => {
//     req.logout();
//     res.redirect("/");
// });

// //server