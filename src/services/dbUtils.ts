
import { ObjectId } from 'mongodb';

// Helper function to convert string ID to ObjectId
export const toObjectId = (id: string): ObjectId => {
  try {
    return new ObjectId(id);
  } catch (error) {
    console.error('Invalid ObjectId format:', error);
    throw new Error('Invalid ID format');
  }
};

// Function to get current timestamp
export const getCurrentTimestamp = (): Date => {
  return new Date();
};

// Function to get a date from N days ago
export const getDateDaysAgo = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};
