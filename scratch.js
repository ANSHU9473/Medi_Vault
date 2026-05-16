require('dotenv').config({ path: './Backend/.env' });
const mongoose = require('mongoose');
const User = require('./Backend/models/User');

async function test() {
    await mongoose.connect(process.env.MONGODB_URI);
    const users = await User.find({});
    console.log(JSON.stringify(users, null, 2));
    process.exit(0);
}
test();
