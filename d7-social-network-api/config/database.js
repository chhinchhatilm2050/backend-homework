import mongoose from "mongoose";
import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4'])
const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_DB, {
            dbName: 'socail-network-api'
        });
        console.log('MongDB connected successfully')
    } catch(error) {
        console.error('MongoDB connection error', error);
        process.exit(1);
    }
};
export {connectDB};