import mongoose from 'mongoose';

export default new Promise((resolve, reject) => {
    if (!process.env.MONGODB_URI) {
        return reject('Insert a MONGODB_URI connection string into .env.local');
    }
    if (mongoose.connection.readyState == mongoose.ConnectionStates.connected) {
        return resolve('Connected');
    }

    mongoose.connect(process.env.MONGODB_URI).then(resolve).catch(reject);
});
