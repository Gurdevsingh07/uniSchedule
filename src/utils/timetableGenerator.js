import { generateUniqueId } from './timetableUtils';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
];

// Helper to check if a time slot is available
const isSlotAvailable = (timetable, day, time, teacher, room) => {
  return !timetable.some(entry => 
    entry.day === day && 
    entry.time === time && 
    (entry.teacher === teacher || entry.room === room)
  );
};

// Helper to find available slots for a subject
const findAvailableSlots = (timetable, facultyPrefs, studentPrefs, subject) => {
  const availableSlots = [];
  
  // Get faculty preferences for this subject
  const facultySubjectPrefs = Object.entries(facultyPrefs)
    .filter(([_, pref]) => pref.subject === subject)
    .map(([id, pref]) => ({ ...pref, id }));
  
  // Get student preferences for this subject
  const studentSubjectPrefs = Object.entries(studentPrefs)
    .filter(([_, pref]) => pref.subject === subject)
    .map(([id, pref]) => ({ ...pref, id }));
  
  // First try to match faculty preferences (highest priority)
  for (const pref of facultySubjectPrefs) {
    if (isSlotAvailable(timetable, pref.day, pref.time, pref.teacher, pref.room)) {
      availableSlots.push({
        day: pref.day,
        time: pref.time,
        teacher: pref.teacher,
        room: pref.room,
        score: 3 // Highest score for faculty preference matches
      });
    }
  }
  
  // Then try to match student preferences (medium priority)
  for (const pref of studentSubjectPrefs) {
    if (isSlotAvailable(timetable, pref.day, pref.time, pref.teacher, pref.room)) {
      availableSlots.push({
        day: pref.day,
        time: pref.time,
        teacher: pref.teacher,
        room: pref.room,
        score: 2 // Medium score for student preference matches
      });
    }
  }
  
  // Finally try all other slots (lowest priority)
  for (const day of DAYS) {
    for (const time of TIME_SLOTS) {
      if (isSlotAvailable(timetable, day, time, facultySubjectPrefs[0]?.teacher, facultySubjectPrefs[0]?.room)) {
        availableSlots.push({
          day,
          time,
          teacher: facultySubjectPrefs[0]?.teacher,
          room: facultySubjectPrefs[0]?.room,
          score: 1 // Lowest score for non-preference matches
        });
      }
    }
  }
  
  return availableSlots;
};

// Main timetable generation function
export const generateTimetable = (preferences) => {
  const timetable = [];
  const { faculty: facultyPrefs, student: studentPrefs } = preferences;
  
  // Get all unique subjects from both faculty and student preferences
  const subjects = [...new Set([
    ...Object.values(facultyPrefs).map(p => p.subject),
    ...Object.values(studentPrefs).map(p => p.subject)
  ])];
  
  // Sort subjects by number of preferences (most preferred first)
  subjects.sort((a, b) => {
    const aFacultyCount = Object.values(facultyPrefs).filter(p => p.subject === a).length;
    const bFacultyCount = Object.values(facultyPrefs).filter(p => p.subject === b).length;
    const aStudentCount = Object.values(studentPrefs).filter(p => p.subject === a).length;
    const bStudentCount = Object.values(studentPrefs).filter(p => p.subject === b).length;
    
    // Weight faculty preferences more heavily than student preferences
    const aTotal = (aFacultyCount * 2) + aStudentCount;
    const bTotal = (bFacultyCount * 2) + bStudentCount;
    
    return bTotal - aTotal;
  });
  
  // Try to schedule each subject
  for (const subject of subjects) {
    const availableSlots = findAvailableSlots(timetable, facultyPrefs, studentPrefs, subject);
    
    if (availableSlots.length === 0) {
      console.warn(`Could not find slot for subject: ${subject}`);
      continue;
    }
    
    // Sort slots by score (preference matches first)
    availableSlots.sort((a, b) => b.score - a.score);
    
    // Take the best available slot
    const bestSlot = availableSlots[0];
    timetable.push({
      id: generateUniqueId(),
      subject,
      day: bestSlot.day,
      time: bestSlot.time,
      teacher: bestSlot.teacher,
      room: bestSlot.room
    });
  }
  
  return timetable;
};

// Helper to validate generated timetable
export const validateTimetable = (timetable) => {
  const errors = [];
  
  // Check for conflicts
  for (let i = 0; i < timetable.length; i++) {
    for (let j = i + 1; j < timetable.length; j++) {
      const entry1 = timetable[i];
      const entry2 = timetable[j];
      
      // Check teacher conflicts
      if (entry1.day === entry2.day && 
          entry1.time === entry2.time && 
          entry1.teacher === entry2.teacher) {
        errors.push(`Teacher conflict: ${entry1.teacher} has two classes at ${entry1.time} on ${entry1.day}`);
      }
      
      // Check room conflicts
      if (entry1.day === entry2.day && 
          entry1.time === entry2.time && 
          entry1.room === entry2.room) {
        errors.push(`Room conflict: Room ${entry1.room} has two classes at ${entry1.time} on ${entry1.day}`);
      }
    }
  }
  
  return errors;
}; 