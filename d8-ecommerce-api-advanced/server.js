import { connectDB } from "./config/database.js";
import app from './app.js'
const PORT = process.env.PORT || 3000;
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server listen on port ${PORT}`)
        })
    } catch(error) {
        console.error('Server failed to start:', err.message);
        process.exit(1);
    }
}

startServer();