const axios = require('axios');
const mongoose = require('mongoose');

async function runChecks() {
    console.log('Running production checks...');
    
    try {
        // Check database connection
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Database connection successful');

        // Check main routes
        const routes = [
            '/api/services',
            '/api/products',
            '/api/auth/login'
        ];

        for (const route of routes) {
            try {
                await axios.get(`${process.env.BASE_URL}${route}`);
                console.log(`✅ Route ${route} is responding`);
            } catch (error) {
                console.error(`❌ Route ${route} failed:`, error.message);
            }
        }

    } catch (error) {
        console.error('❌ Production check failed:', error);
    }
}

runChecks(); 