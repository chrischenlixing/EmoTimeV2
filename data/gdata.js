const Chance = require('chance');
const fs = require('fs');

const chance = new Chance();

const shiftList = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const generateData = () => {
  const data = [];
  for (let i = 0; i < 1000; i++) {
    const firstName = chance.first();

    const record = {
      name: firstName,
      shift: chance.pickone(shiftList),
      reviews: chance.pickone([null, 'Good', 'Average', 'Bad']),
      // Add other fields as needed
    };
    data.push(record);
  }
  return data;
};

const syntheticData = generateData();

fs.writeFileSync('synthetic_data.json', JSON.stringify(syntheticData, null, 2));

console.log('Synthetic data generated and saved to synthetic_data.json');

