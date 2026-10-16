import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Start Express server
        app.listen(PORT, () => {
            console.log('');
            console.log('═══════════════════════════════════════');
            console.log('   🚀 BlogFlow API Server Started');
            console.log('═══════════════════════════════════════');
            console.log(`   Port : ${PORT}`);
            console.log(`   Mode : ${process.env.NODE_ENV}`);
            console.log(`   URL  : http://localhost:${PORT}`);
            console.log('═══════════════════════════════════════');
            console.log('');
        });

    } catch (error) {
        console.error(`❌ Server failed to start: ${error.message}`);
        process.exit(1);
    }
};

startServer();