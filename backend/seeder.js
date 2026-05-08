const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Expert = require('./models/Expert');
const connectDB = require('./config/db');

dotenv.config();

const experts = [
  {
    name: 'Dr. Priya Sharma',
    category: 'Career Coaching',
    experience: 8,
    rating: 4.8,
    description: 'Helps professionals plan career moves, interviews, and skill growth.',
    slots: [
      { date: '2026-05-09', times: ['09:00', '10:00', '14:00'] },
      { date: '2026-05-10', times: ['11:00', '15:00', '16:00'] }
    ]
  },
  {
    name: 'Anil Kapoor',
    category: 'Data Science',
    experience: 10,
    rating: 4.7,
    description: 'Expert in machine learning, model development and interview preparation.',
    slots: [
      { date: '2026-05-09', times: ['10:00', '13:00', '16:00'] },
      { date: '2026-05-11', times: ['09:00', '12:00', '17:00'] }
    ]
  },
  {
    name: 'Sneha Verma',
    category: 'Startup Mentorship',
    experience: 12,
    rating: 4.9,
    description: 'Guides founders on pitch decks, fundraising, and growth strategy.',
    slots: [
      { date: '2026-05-10', times: ['09:00', '11:00', '15:00'] },
      { date: '2026-05-12', times: ['10:00', '14:00', '16:00'] }
    ]
  }
];

const importData = async () => {
  try {
    await connectDB();
    await Expert.deleteMany();
    await Expert.insertMany(experts);
    console.log('Seed data imported');
    process.exit();
  } catch (error) {
    console.error(`Seeding failed: ${error}`);
    process.exit(1);
  }
};

importData();
