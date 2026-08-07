
// const express = require('express');
// const app = express();
// const port = 8080;

// // Route that may throw an error
// app.get('/error', (req, res) => {
//   // Simulating an error
//   throw new Error('Something went wrong!');
// });

// // Route that uses next(error) for asynchronous code
// app.get('/async-error', (req, res, next) => {
//   // Simulating an asynchronous operation that fails
//   setTimeout(() => {
//     try {
//       // Something that might fail
//       const result = nonExistentFunction(); // This will throw an error
//       res.send(result);
//     }
//     catch (error) {
//       next(error); // Pass errors to Express
//     }
//     }, 100);
// });

// // Custom error handling middleware
// // Must have four parameters to be recognized as an error handler
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// });

// ///////////

// const express = require('express');
// const path = require('path');
// const app = express();
// const port = 8080;

// // Serve static files from the 'public' directory
// app.use(express.static('public'));

// // You can also specify a virtual path prefix
// app.use('/static', express.static('public'));

// // Using absolute path (recommended)
// app.use('/assets', express.static(path.join(__dirname, 'public')));

// app.get('/', (req, res) => {
//   res.send(`
//     <h1>Static Files Example</h1>
//     <img src="/images/logo.png" alt="Logo">
//     <link rel="stylesheet" href="/css/style.css">
//     <script src="/js/script.js"></script>
//   `);
// });

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// });

// ////////////////////////////////////
// // npm install -g express-generator
// // Security middleware
// app.use(helmet());

// // CORS configuration
// app.use(cors({
//   origin: 'https://example.com',
//   methods: ['GET', 'POST'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// ///
// app.use((req, res, next) => {
//   // Middleware code goes here
//   console.log('Time:', Date.now());
  
//   // Call next() to pass control to the next middleware function
//   next();
// });

// //////////////////////////////////////////////

// const express = require('express');
// const app = express();

// // Application-level middleware
// app.use((req, res, next) => {
//   console.log('Time:', Date.now());
//   next();
// });
// ///////////////

// const express = require('express');
// const app = express();

// // Middleware for parsing JSON
// app.use(express.json());

// let users = [
//   { id: 1, name: 'John Doe', email: 'john@example.com' },
//   { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
// ];

// // GET - Retrieve all users
// app.get('/api/users', (req, res) => {
//   res.json(users);
// });

// // GET - Retrieve a specific user
// app.get('/api/users/:id', (req, res) => {
//   const user = users.find(u => u.id === parseInt(req.params.id));
//   if (!user) return res.status(404).json({ message: 'User not found' });
//   res.json(user);
// });

// // POST - Create a new user
// app.post('/api/users', (req, res) => {
//   const newUser = {
//     id: users.length + 1,
//     name: req.body.name,
//     email: req.body.email
//   };
//   users.push(newUser);
//   res.status(201).json(newUser);
// });

// // PUT - Update a user completely
// app.put('/api/users/:id', (req, res) => {
//   const user = users.find(u => u.id === parseInt(req.params.id));
//   if (!user) return res.status(404).json({ message: 'User not found' });

//   user.name = req.body.name;
//   user.email = req.body.email;

//   res.json(user);
// });

// // DELETE - Remove a user
// app.delete('/api/users/:id', (req, res) => {
//   const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
//   if (userIndex === -1) return res.status(404).json({ message: 'User not found' });

//   const deletedUser = users.splice(userIndex, 1);
//   res.json(deletedUser[0]);
// });

// app.listen(8080, () => {
//   console.log('REST API server running on port 8080');
// });

// // Filtering and pagination
// // app.get('/api/products?category=electronics&sort=price&limit=10&page=2');
// ///
// const express = require('express');
// const Joi = require('joi');
// const app = express();

// app.use(express.json());

// // Validation schema
// const userSchema = Joi.object({
//   name: Joi.string().min(3).required(),
//   email: Joi.string().email().required(),
//   age: Joi.number().integer().min(18).max(120)
// });

// app.post('/api/users', (req, res) => {
//   // Validate request body
//   const { error } = userSchema.validate(req.body);
//   if (error) {
//     return res.status(400).json({ message: error.details[0].message });
//   }

//   // Process valid request
//   // ...
//   res.status(201).json({ message: 'User created successfully' });
// });

// app.listen(8080);
////////////////////

const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const app = express();

// Configure sessions for OAuth 2.0
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Configure Google OAuth 2.0 strategy
passport.use(new GoogleStrategy({
    clientID: 'YOUR_GOOGLE_CLIENT_ID',
    clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
    callbackURL: 'http://localhost:8080/auth/google/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    // In a real app, you'd find or create a user in your database
    const user = {
      id: profile.id,
      displayName: profile.displayName,
      email: profile.emails[0].value,
      provider: 'google'
    };
   
    return done(null, user);
  }
));

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Routes for Google OAuth
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication
    res.redirect('/profile');
  }
);

// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

// Protected route
app.get('/profile', isAuthenticated, (req, res) => {
  res.json({ user: req.user });
});

// Logout route
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Start server
app.listen(8080, () => {
  console.log('Server running on port 8080');
});
//Also API key authentication

////GraphQL
//npm install express express-graphql graphql
////////////////////////////////////////////////
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// Sample data
const books = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    year: 1925,
    genre: 'Novel'
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    year: 1960,
    genre: 'Southern Gothic'
  }
];

/////////graphql schema
const schema = buildSchema(`
  # A book has a title, author, and publication year
  type Book {
    id: ID!
    title: String!
    author: String!
    year: Int
    genre: String
  }

  # The "Query" type is the root of all GraphQL queries
  type Query {
    # Get all books
    books: [Book!]!
    # Get a specific book by ID
    book(id: ID!): Book
    # Search books by title or author
    searchBooks(query: String!): [Book!]!
  }
`);

//////////////////Resolvers
// Define resolvers for the schema fields
const root = {
  // Resolver for fetching all books
  books: () => books,
  
  // Resolver for fetching a single book by ID
  book: ({ id }) => books.find(book => book.id === id),
  
  // Resolver for searching books
  searchBooks: ({ query }) => {
    const searchTerm = query.toLowerCase();
    return books.filter(
      book =>
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm)
    );
  }
};

/////////////

// Create an Express app
const app = express();

// Set up the GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  // Enable the GraphiQL interface for testing
  graphiql: true,
}));

// Start the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/graphql`);
});

///////////////////socket.io////////////

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Simple route
app.get('/', (req, res) => {
;  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle new messages
  socket.on('chat message', (msg) => {
    console.log('Message received:', msg);
    // Broadcast the message to all connected clients
      io.emit('chat message', msg);
    });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

////////////ws/////////////////
const WebSocket = require('ws');

// Create a WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });

console.log('WebSocket server is running on ws://localhost:8080');

// Connection event handler
wss.on('connection', (ws) => {
  console.log('New client connected');
  
  // Send a welcome message to the client
  ws.send('Welcome to the WebSocket server!');

  // Message event handler
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    // Echo the message back to the client
    ws.send(`Server received: ${message}`);
  });

  // Close event handler
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
//////////////////////
