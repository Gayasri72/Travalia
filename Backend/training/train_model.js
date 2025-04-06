// import * as tf from '@tensorflow/tfjs-node';
// import fs from 'fs';

// // Load dataset
// const rawData = JSON.parse(
//   fs.readFileSync('../dev-data/data/trip.json', 'utf8'),
// );

// // Preprocessing helpers
// const oneHotWeather = (weather) => {
//   return [
//     weather === 'Sunny' ? 1 : 0,
//     weather === 'Rainy' ? 1 : 0,
//     weather === 'Cloudy' ? 1 : 0,
//     weather === 'Windy' ? 1 : 0,
//   ];
// };

// const oneHotInterests = (interests) => {
//   return [
//     interests.includes('Beach') ? 1 : 0,
//     interests.includes('Hiking') ? 1 : 0,
//     interests.includes('Culture') ? 1 : 0,
//     interests.includes('Nature') ? 1 : 0,
//     interests.includes('Relaxation') ? 1 : 0,
//   ];
// };

// // Extract features and labels (each day as one training sample)
// const features = [];
// const labels = [];

// rawData.forEach((trip) => {
//   const { members, budget, interests, trip_plan } = trip;

//   trip_plan.forEach((dayPlan) => {
//     const day = dayPlan.day;
//     const district = dayPlan.district;
//     const weather = dayPlan.weather;
//     const activities = dayPlan.activities;

//     const weatherEncoded = oneHotWeather(weather);
//     const interestsEncoded = oneHotInterests(interests);

//     const featureVector = [
//       day,
//       members,
//       budget,
//       ...weatherEncoded,
//       ...interestsEncoded,
//     ];

//     features.push(featureVector);
//     labels.push(activities.length); // Label is the number of activities
//   });
// });

// // Convert to tensors
// const X = tf.tensor2d(features);
// const y = tf.tensor1d(labels);

// // Normalize numeric features (first 3 only: day, members, budget)
// const numericCols = X.slice([0, 0], [-1, 3]);
// const categoricalCols = X.slice([0, 3], [-1, X.shape[1] - 3]);

// const maxVals = tf.max(numericCols, 0);
// const normalizedNumeric = numericCols.div(maxVals);

// const XNormalized = normalizedNumeric.concat(categoricalCols, 1);

// // Build the model
// const model = tf.sequential();
// model.add(tf.layers.dense({ units: 32, activation: 'relu', inputShape: [X.shape[1]] }));
// model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
// model.add(tf.layers.dense({ units: 1, activation: 'linear' }));

// // Compile the model
// model.compile({
//   optimizer: 'adam',
//   loss: 'meanSquaredError',
//   metrics: ['mae'],
// });

// // Train and save the model
// (async () => {
//   await model.fit(XNormalized, y, {
//     epochs: 50,
//     batchSize: 16,
//   });

//   await model.save('file://./tfjs_model');
//   console.log('✅ Model training completed and saved in tfjs_model directory.');
// })();

//....................................................................................................................


import * as tf from '@tensorflow/tfjs-node';
import fs from 'fs';

// Load dataset
const rawData = JSON.parse(fs.readFileSync('../dev-data/data/trip.json', 'utf-8'));

// Enhanced preprocessing helpers
const oneHotWeather = (weather) => {
  const weatherTypes = ['Sunny', 'Rainy', 'Cloudy', 'Windy', 'Cool'];
  return weatherTypes.map(type => weather === type ? 1 : 0);
};

const oneHotInterests = (interests) => {
  const interestTypes = ['Beach', 'Hiking', 'Culture', 'Nature', 'Relaxation', 'History', 'Food'];
  return interestTypes.map(type => interests.includes(type) ? 1 : 0);
};

// Extract features and labels
const features = [];
const labels = [];

rawData.forEach((trip) => {
  const { members, budget, interests, daily_weather } = trip;

  daily_weather.forEach((dayPlan) => {
    const weatherEncoded = oneHotWeather(dayPlan.weather);
    const interestsEncoded = oneHotInterests(interests);

    // Feature vector: [day, members, budget, ...weather, ...interests]
    const featureVector = [
      dayPlan.day,
      members,
      budget,
      ...weatherEncoded,
      ...interestsEncoded
    ];

    features.push(featureVector);
    labels.push(dayPlan.activities.length);
  });
});

// Convert to tensors and normalize
const X = tf.tensor2d(features);
const y = tf.tensor1d(labels);

// Normalize numeric features
const numericCols = X.slice([0, 0], [-1, 3]); // day, members, budget
const maxVals = tf.max(numericCols, 0);
const normalizedNumeric = numericCols.div(maxVals);

const categoricalCols = X.slice([0, 3], [-1, -1]);
const XNormalized = tf.concat([normalizedNumeric, categoricalCols], 1);

// Enhanced model architecture
const model = tf.sequential();
model.add(tf.layers.dense({
  units: 64,
  activation: 'relu',
  inputShape: [XNormalized.shape[1]]
}));
model.add(tf.layers.dropout({ rate: 0.2 }));
model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
model.add(tf.layers.dense({ units: 1, activation: 'linear' }));

// Compile with adjusted learning rate
model.compile({
  optimizer: tf.train.adam(0.001),
  loss: 'meanSquaredError',
  metrics: ['mae'],
});

// Training with validation split
(async () => {
  const history = await model.fit(XNormalized, y, {
    epochs: 100,
    batchSize: 32,
    validationSplit: 0.2,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(`Epoch ${epoch}: loss = ${logs.loss.toFixed(4)}, val_loss = ${logs.val_loss.toFixed(4)}`);
      }
    }
  });

  await model.save('file://./tfjs_model');
  console.log('Model saved successfully');
})();