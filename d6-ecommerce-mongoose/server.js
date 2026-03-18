import app from './app.js';
import { connectDB } from './config/database.js';
const PORT = process.env.RORT || 3000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Application listen on port ${PORT}`);
        })
    } catch(err) {
        console.error('Server failed to start:', err.message);
        process.exit(1);
    }
};
startServer();