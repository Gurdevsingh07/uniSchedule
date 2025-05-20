export const sampleTimetableEntry = {
  id: "unique-id",
  day: "Monday",
  time: "9:00 AM",
  subject: "Mathematics",
  teacher: "John Doe",
  room: "Room 101"
};

export const generateUniqueId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const validateTimetableEntry = (entry) => {
  const requiredFields = ['day', 'time', 'subject', 'teacher', 'room'];
  return requiredFields.every(field => entry[field]);
};