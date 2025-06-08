import express from 'express';
import cors from 'cors';
import { ApiError } from './utils/apiError.js';
import { ErrorHandler } from './middlewares/errorHandling.middleware.js';
import { decryptMiddleware, encryptMiddleware } from './middlewares/encryptMiddleware.js';
import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/task.routes.js';
import chatRoutes from './routes/chat.routes.js';

const app = express();


// Middlewares
app.use(cors());
app.use(express.json());

// Crypto middleware (request decryption + response encryption)
app.use(decryptMiddleware);
app.use(encryptMiddleware);



app.get('/', (req, res) => {
  return res.status(201).render('welcome-email');
});


app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/chat', chatRoutes);

// app.all('*', (req, res, next) => {
//   next(new ApiError(`${req.originalUrl} <- this Route not found!!`, 404));
// });


app.use(ErrorHandler);

export { app };