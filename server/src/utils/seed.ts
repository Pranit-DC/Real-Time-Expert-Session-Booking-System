import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import Expert from '../models/Expert';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const generateSlots = () => {
  const times = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '02:00 PM', '03:00 PM',
    '04:00 PM', '05:00 PM',
  ];
  return times.map((time) => ({ time, isBooked: false }));
};

const getDatesFromToday = (count: number): string[] => {
  const dates: string[] = [];
  for (let i = 1; i <= count; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
};

const experts = [
  {
    name: 'Dr. Aisha Mehta',
    category: 'Machine Learning',
    experience: 12,
    rating: 4.9,
    bio: 'Principal researcher at a leading AI lab. Specializes in NLP and transformer architectures.',
    avatar: 'https://i.pravatar.cc/150?img=47',
  },
  {
    name: 'Carlos Rivera',
    category: 'System Design',
    experience: 15,
    rating: 4.8,
    bio: 'Staff engineer with experience scaling distributed systems at high-growth startups.',
    avatar: 'https://i.pravatar.cc/150?img=12',
  },
  {
    name: 'Priya Nair',
    category: 'Frontend',
    experience: 8,
    rating: 4.7,
    bio: 'Frontend architect focused on performance, accessibility, and design systems.',
    avatar: 'https://i.pravatar.cc/150?img=45',
  },
  {
    name: 'James Otieno',
    category: 'Backend',
    experience: 10,
    rating: 4.6,
    bio: 'Backend engineer specializing in Node.js microservices and event-driven architecture.',
    avatar: 'https://i.pravatar.cc/150?img=68',
  },
  {
    name: 'Lena Vogel',
    category: 'DevOps',
    experience: 9,
    rating: 4.5,
    bio: 'DevOps lead with deep expertise in Kubernetes, Terraform, and CI/CD pipelines.',
    avatar: 'https://i.pravatar.cc/150?img=36',
  },
  {
    name: 'Ravi Shankar',
    category: 'Machine Learning',
    experience: 7,
    rating: 4.4,
    bio: 'ML engineer building production recommendation systems and computer vision pipelines.',
    avatar: 'https://i.pravatar.cc/150?img=60',
  },
  {
    name: 'Sakura Tanaka',
    category: 'Frontend',
    experience: 6,
    rating: 4.6,
    bio: 'Specializes in React performance optimization and micro-frontend architecture.',
    avatar: 'https://i.pravatar.cc/150?img=44',
  },
  {
    name: 'Omar Hassan',
    category: 'System Design',
    experience: 11,
    rating: 4.7,
    bio: 'Engineering manager with expertise in database sharding and cache design patterns.',
    avatar: 'https://i.pravatar.cc/150?img=15',
  },
  {
    name: 'Sofia Almeida',
    category: 'Backend',
    experience: 8,
    rating: 4.5,
    bio: 'Specializes in RESTful API design, GraphQL, and database optimization.',
    avatar: 'https://i.pravatar.cc/150?img=32',
  },
  {
    name: 'Nathan Brooks',
    category: 'DevOps',
    experience: 13,
    rating: 4.8,
    bio: 'Site reliability engineer who has architected zero-downtime deployments at scale.',
    avatar: 'https://i.pravatar.cc/150?img=11',
  },
];

const seed = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Connected to MongoDB');

    await Expert.deleteMany({});
    console.log('Cleared existing experts');

    const dates = getDatesFromToday(7);
    const expertsWithAvailability = experts.map((expert) => ({
      ...expert,
      availability: dates.map((date) => ({
        date,
        slots: generateSlots(),
      })),
    }));

    await Expert.insertMany(expertsWithAvailability);
    console.log(`Seeded ${experts.length} experts with 7-day availability`);
  } catch (err) {
    console.error('Seed failed:', (err as Error).message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seed();
