import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

dotenv.config({ path: './config.env' });
import app from './app.js';


const db = process.env.MONGO_STRING.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose
  .connect(db, {
    useNewUrlParser: true,
   // useCreateIndex: true,
   // useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful'));


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`TRAVALIA running on port ${port}...`);
});