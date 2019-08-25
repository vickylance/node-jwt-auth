require('dotenv').config();
const express = require('express');

const app = express();
const mongoose = require('mongoose');
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Require routes
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

// Connect to DB
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true }, () => {
  console.log('Connected to DB!');
});

// Middlewares
app.use(express.json());

// Routes middlewares
app.use('/api/v1/user', authRoutes);
app.use('/api/v1/posts', postRoutes);

app.set('PORT', process.env.PORT || 3000);

app.listen(app.get('PORT'), () => {
  console.log(`Server started on port: ${app.get('PORT')}`);
});
