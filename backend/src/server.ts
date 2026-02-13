import { env } from './config/env.js';
import app from './app.js';

const startServer = async () => {
    try {
        app.listen(env.PORT, () => {
            console.log(`🚀 Server is running on port ${env.PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
