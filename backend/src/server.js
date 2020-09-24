const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const http = require('http');
const { graphqlHTTP } = require('express-graphql');

const auth = require('./config/verifyToken');
const uploadConfig = require('./config/upload');
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');

const app = express();
const server = http.Server(app);

const PORT = process.env.PORT || 8000;

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

try {
  mongoose.connect(process.env.MONGO_DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('MongoDB connected');
} catch (e) {
  console.log(e);
}

app.use(cors());
app.use(express.json());
app.use('/files', express.static(path.join(__dirname, '..', 'files')));
app.use(uploadConfig.single('thumbnail'));
app.use(auth);

app.put('/post-image', (req, res, next) => {
  if (!req.isAuth) {
    throw new Error('Not Authenticated');
  }
  if (!req.file) {
    return res.status(200).json({ message: 'No file provided' });
  }
  return res
    .status(201)
    .json({
      message: 'File Uploaded',
      filePath: req.file.path.split('/backend')[1],
    });
});

app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
  })
);

app.use((error, req, res, next) => {
  console.log(error);
  const { statusCode, message } = error;
  res.status(statusCode || 500).json({ message });
});

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
