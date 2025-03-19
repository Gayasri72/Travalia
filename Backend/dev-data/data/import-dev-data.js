import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Tour from '../../models/tour.model.js';

dotenv.config({ path: './config.env' });

const db = process.env.MONGO_STRING.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose
  .connect(db, {})
  .then(() => console.log('TRAVALIA DB connection successful'));

// Read JSON file
const tours = JSON.parse(
  fs.readFileSync('Backend/dev-data/data/tours-simple.json', 'utf-8'),
);

// Import data into DB

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// Delete all data from collection

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
