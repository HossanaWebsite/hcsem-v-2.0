import pkg from '@next/env';
const { loadEnvConfig } = pkg;
import mongoose from 'mongoose';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

async function run() {
    await mongoose.connect(process.env.MONGODB_URI);
    const settings = await mongoose.connection.collection('sitesettings').findOne();
    console.log(JSON.stringify(settings.tickerImages, null, 2));
    process.exit(0);
}
run();
