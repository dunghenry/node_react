const mongoose = require('mongoose');
const colors = require('colors');
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(colors.green('Connected database successfully!!'));
    } catch (error) {
        console.error(colors.red('Connected database failed!!'));
        process.exit(1);
    }
};

process.on('SIGINT', async () => {
    console.log(colors.red('You are performing a server shutdown!'));
    await mongoose.connection.close();
    process.exit(0);
});
module.exports = connectDB;
