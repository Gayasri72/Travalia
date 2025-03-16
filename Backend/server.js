import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

dotenv.config({ path: './config.env' });

const db = process.env.MONGO_STRING.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose
  .connect(db, {})
  .then(() => console.log('TRAVALIA DB connection successful'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`TRAVALIA server running on port ${port}...`);
});
