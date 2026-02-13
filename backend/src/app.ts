import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.js';
import contactsRouter from './routes/contacts.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/contacts', contactsRouter);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling
app.use(errorHandler);

export default app;
