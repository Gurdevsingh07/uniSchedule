import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { db } from '../utils/firebase';
import { 
  doc, 
  setDoc, 
  onSnapshot, 
  collection, 
  query, 
  where, 
  addDoc, 
  orderBy, 
  getDocs, 
  deleteDoc, 
  getDoc, 
  updateDoc // Add updateDoc here
} from 'firebase/firestore'

const TimetableContext = createContext()

const useTimetable = () => {
  const context = useContext(TimetableContext)
  if (!context) {
    throw new Error('useTimetable must be used within a TimetableProvider')
  }
  return context
}

const TimetableProvider = ({ children }) => {
  const [timetableData, setTimetableData] = useState({})
  const [teachers, setTeachers] = useState([])
  const [subjects, setSubjects] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDay, setSelectedDay] = useState('All Days')
  const [facultyPreferences, setFacultyPreferences] = useState({})
  const [studentPreferences, setStudentPreferences] = useState({})
  const [feedback, setFeedback] = useState([])
  const [finalized, setFinalizedState] = useState(false)
  const [approved, setApprovedState] = useState(false)
  const [notifications, setNotifications] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [generationWarnings, setGenerationWarnings] = useState([]);
  const [lastTimetableUpdate, setLastTimetableUpdate] = useState(Date.now());
  const [uploadedScheduleItems, setUploadedScheduleItems] = useState([]); // New state for uploaded items

  // Load faculty preferences from Firestore
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'preferences', 'faculty'), (docSnap) => {
      if (docSnap.exists()) {
        setFacultyPreferences(docSnap.data() || {});
      } else {
        // Initialize if doesn't exist, though save functions should create it
        setDoc(doc(db, 'preferences', 'faculty'), {}); 
      }
    });
    return () => unsub();
  }, []);

  // Load student preferences from Firestore
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'preferences', 'students'), (docSnap) => {
      if (docSnap.exists()) {
        setStudentPreferences(docSnap.data() || {});
      } else {
        // Initialize if doesn't exist
        setDoc(doc(db, 'preferences', 'students'), {});
      }
    });
    return () => unsub();
  }, []);

  // Load feedback from Firestore (now from 'userFeedbackEntries' collection)
  useEffect(() => {
    const feedbackQuery = query(collection(db, 'userFeedbackEntries'), orderBy('timestamp', 'desc'));
    const unsub = onSnapshot(feedbackQuery, (snapshot) => {
      const allFeedback = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Store as an array now, or transform to object if AdminDashboard expects that
      // For simplicity, let's store as an array and AdminDashboard can adapt or we can change this.
      setFeedback(allFeedback); 
    });
    return () => unsub();
  }, []);

  const validateEntry = useCallback((entry) => {
    // Check required fields
    if (!entry.subject || !entry.teacher || !entry.day || !entry.time) {
      throw new Error('Missing required fields');
    }

    // Check for conflicts
    const hasConflict = Object.values(timetableData).some(
      dayEntries => dayEntries.some(
        existing => 
          existing.id !== entry.id &&
          existing.day === entry.day && 
          existing.time === entry.time
      )
    );

    if (hasConflict) {
      throw new Error('Time slot is already occupied');
    }

    // Check teacher availability
    const hasTeacherConflict = Object.values(timetableData).some(
      dayEntries => dayEntries.some(
        existing =>
          existing.id !== entry.id &&
          existing.day === entry.day &&
          existing.time === entry.time &&
          existing.teacher === entry.teacher
      )
    );

    if (hasTeacherConflict) {
      throw new Error('Teacher is already scheduled for this time');
    }

    return true;
  }, [timetableData]);

  const addEntry = useCallback((entry) => {
    try {
      validateEntry(entry);
      setTimetableData(prev => {
        const newEntry = { ...entry, id: Date.now() };
        const day = newEntry.day;
        if (!prev[day]) {
          prev[day] = [];
        }
        prev[day].push(newEntry);
        return prev;
      });
      return true;
    } catch (error) {
      console.error('Error adding entry:', error);
      return false;
    }
  }, [validateEntry]);

  const updateEntry = useCallback((id, updatedEntry) => {
    try {
      validateEntry(updatedEntry);
      setTimetableData(prev => {
        const day = updatedEntry.day;
        const updatedDayEntries = prev[day].map(entry => entry.id === id ? updatedEntry : entry);
        return { ...prev, [day]: updatedDayEntries };
      });
      return true;
    } catch (error) {
      console.error('Error updating entry:', error);
      return false;
    }
  }, [validateEntry]);

  // Listen for timetable changes in Firestore (real-time for all users)
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'timetable', 'current'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const entriesArray = data.entries || [];
        
        // Transform entriesArray into an object keyed by day
        const transformedEntries = entriesArray.reduce((acc, entry) => {
          const day = entry.day; // Assuming entry has a 'day' property
          if (!acc[day]) {
            acc[day] = [];
          }
          acc[day].push(entry);
          return acc;
        }, {});
        
        setTimetableData(transformedEntries);
        setFinalizedState(data.isFinalized || false); 
        setApprovedState(data.isApproved || false);   
      } else {
        setTimetableData({}); // Default to empty object if no doc
        setFinalizedState(false);
        setApprovedState(false);
      }
    });
    return () => unsub();
  }, []);

  // Listen for notifications for the current user
  useEffect(() => {
    if (!currentUser?.id) return;

    const notificationsQuery = query(
      collection(db, 'userNotifications'),
      where('recipientId', '==', currentUser.id)
    );

    const unsub = onSnapshot(notificationsQuery, (snapshot) => {
      const newNotifications = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Ensure timestamp is a JS Date object for consistent comparison
          timestamp: data.timestamp && typeof data.timestamp.toDate === 'function' 
            ? data.timestamp.toDate() 
            : (data.timestamp ? new Date(data.timestamp) : null)
        };
      }).sort((a, b) => {
        const idA = String(a.id || '');
        const idB = String(b.id || '');
        return idA.localeCompare(idB);
      });
      
      setNotifications(prevNotifications => {
        if (prevNotifications.length !== newNotifications.length) {
          return newNotifications;
        }

        const sortedPrevNotifications = [...prevNotifications].sort((a, b) => {
          const idA = String(a.id || '');
          const idB = String(b.id || '');
          return idA.localeCompare(idB);
        });

        for (let i = 0; i < newNotifications.length; i++) {
          const prevNotif = sortedPrevNotifications[i];
          const newNotif = newNotifications[i];

          if (
            prevNotif.id !== newNotif.id ||
            prevNotif.title !== newNotif.title ||
            prevNotif.message !== newNotif.message ||
            prevNotif.type !== newNotif.type ||
            prevNotif.recipientId !== newNotif.recipientId ||
            (prevNotif.timestamp?.getTime() || null) !== (newNotif.timestamp?.getTime() || null)
          ) {
            return newNotifications; // Found a difference
          }
        }
        return prevNotifications; // No differences found, return old state
      });
    });

    return () => unsub();
  }, [currentUser]);

  // Save timetable to Firestore
  const saveTimetable = async (entries) => {
    await setDoc(doc(db, 'timetable', 'current'), { entries });
  };

  const deleteEntry = useCallback((id) => {
    setTimetableData(prev => {
      const updatedEntries = Object.values(prev).map(dayEntries => dayEntries.filter(entry => entry.id !== id));
      return updatedEntries.reduce((acc, dayEntries, index) => {
        const day = Object.keys(prev)[index];
        acc[day] = dayEntries;
        return acc;
      }, {});
    });
  }, [])

  const importData = useCallback((data) => {
    setTimetableData(data.timetable || {})
    setTeachers(data.teachers || [])
    setSubjects(data.subjects || [])
  }, [])

  const exportData = useCallback(() => {
    return {
      timetable: timetableData,
      teachers,
      subjects
    }
  }, [timetableData, teachers, subjects])

  // Add notification (now saves to Firestore)
  const addNotification = useCallback(async (notification, recipientId) => {
    if (!currentUser?.id) {
      console.warn('Cannot send notification: current user not set.');
      return;
    }
    if (!recipientId) {
       console.warn('Cannot send notification: recipientId not provided.');
       return;
    }

    try {
      // Ensure essential fields are strings and provide defaults if undefined
      const finalTitle = typeof notification.title === 'string' ? notification.title : 'Notification';
      const finalType = typeof notification.type === 'string' ? notification.type : 'info';
      const finalMessage = typeof notification.message === 'string' ? notification.message : 'No message content provided.';
      
      // Detect notification category based on content or explicit category
      let category = notification.category || 'general';
      
      // Auto-detect category if not explicitly provided
      if (category === 'general') {
        if (finalTitle.toLowerCase().includes('feedback') || finalMessage.toLowerCase().includes('feedback')) {
          category = 'feedback';
        } else if (finalTitle.toLowerCase().includes('preference') || finalMessage.toLowerCase().includes('preference')) {
          category = 'preference';
        }
      }

      const notificationData = {
        ...notification, // Spread original notification first to keep any other properties
        title: finalTitle,
        type: finalType,
        message: finalMessage,
        category: category, // Add category for filtering and special popups
        senderId: currentUser.id,
        recipientId: recipientId,
        timestamp: new Date().toISOString(),
        read: false,
      };
      
      const docRef = await addDoc(collection(db, 'userNotifications'), notificationData);
      
      // Add the Firestore document ID to the local notification
      const localNotification = { 
        ...notificationData, 
        id: docRef.id // Use the actual Firestore ID
      };
      
      // Update local state for immediate feedback
      setNotifications(prev => [...prev, localNotification]);

    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }, [currentUser]);

  // Dismiss notification - can either mark as read or delete based on options
  const dismissNotification = useCallback(async (id, options = {}) => {
    try {
      // Check if the notification exists
      const notificationRef = doc(db, 'userNotifications', id);
      const notificationSnap = await getDoc(notificationRef);
      
      if (!notificationSnap.exists()) {
        console.warn(`Notification with ID ${id} not found`);
        return;
      }
      
      // If markAsRead option is true, update the notification to mark it as read
      // Otherwise, delete the notification
      if (options.markAsRead) {
        await updateDoc(notificationRef, { read: true });
        
        // Update local state immediately for better UX
        setNotifications(prev => 
          prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
      } else {
        // Delete the notification
        await deleteDoc(notificationRef);
        
        // Update local state immediately for better UX
        setNotifications(prev => prev.filter(n => n.id !== id));
      }
    } catch (error) {
      console.error("Error handling notification: ", error);
    }
  }, []);

  // Enhanced preference saving with notifications
  const saveFacultyPreference = useCallback(async (facultyId, preference) => {
    const currentFacultyPrefs = facultyPreferences; // Use the state directly for current value
    const newFacultyPrefs = {
      ...currentFacultyPrefs,
      [facultyId]: {
        ...preference,
        timestamp: new Date().toISOString(),
        type: 'faculty'
      }
    };
    await setDoc(doc(db, 'preferences', 'faculty'), newFacultyPrefs);
    // Local state will be updated by the Firestore listener
    
    // Get faculty name if available
    const facultyName = preference.facultyName || 'A faculty member';
    
    // Send notification with explicit preference category
    addNotification({
      type: 'success',
      category: 'preference', // Explicitly set category for special popup
      title: 'Faculty Preference Saved',
      message: `${facultyName} has submitted a preference for ${preference.subject}.`,
      timestamp: new Date().toISOString(),
      preferenceData: { // Include additional data for detailed view
        subject: preference.subject,
        facultyId: facultyId,
        preferenceType: 'faculty'
      }
    }, facultyId);
    
    // Also notify admin if this wasn't submitted by an admin
    if (currentUser?.role !== 'admin') {
      // Find admin users to notify
      const adminId = 'admin1'; // Replace with actual admin ID or logic to find admins
      addNotification({
        type: 'info',
        category: 'preference',
        title: 'New Faculty Preference',
        message: `${facultyName} has submitted a preference for ${preference.subject}.`,
        timestamp: new Date().toISOString(),
        userName: facultyName,
        preferenceData: {
          subject: preference.subject,
          facultyId: facultyId,
          preferenceType: 'faculty'
        }
      }, adminId);
    }
  }, [addNotification, facultyPreferences, currentUser]); // Added currentUser to dependency array

  const saveStudentPreference = useCallback(async (studentId, preference) => {
    const currentStudentPrefs = studentPreferences; // Use the state directly for current value
    const newStudentPrefs = {
      ...currentStudentPrefs,
      [studentId]: {
        ...preference,
        timestamp: new Date().toISOString(),
        type: 'student'
      }
    };
    await setDoc(doc(db, 'preferences', 'students'), newStudentPrefs);
    // Local state will be updated by the Firestore listener
    
    // Get student name if available
    const studentName = preference.studentName || 'A student';
    
    // Send notification with explicit preference category
    addNotification({
      type: 'success',
      category: 'preference', // Explicitly set category for special popup
      title: 'Student Preference Saved',
      message: `Your preference for ${preference.subject} has been saved.`,
      timestamp: new Date().toISOString(),
      preferenceData: { // Include additional data for detailed view
        subject: preference.subject,
        studentId: studentId,
        preferenceType: 'student'
      }
    }, studentId);
    
    // Also notify admin
    if (currentUser?.role !== 'admin') {
      // Find admin users to notify
      const adminId = 'admin1'; // Replace with actual admin ID or logic to find admins
      addNotification({
        type: 'info',
        category: 'preference',
        title: 'New Student Preference',
        message: `${studentName} has submitted a preference for ${preference.subject}.`,
        timestamp: new Date().toISOString(),
        userName: studentName,
        preferenceData: {
          subject: preference.subject,
          studentId: studentId,
          preferenceType: 'student'
        }
      }, adminId);
    }
  }, [addNotification, studentPreferences, currentUser]); // Added currentUser to dependency array

  // Get all preferences (both faculty and student)
  const getAllPreferences = useCallback(() => {
    return {
      faculty: facultyPreferences,
      student: studentPreferences
    }
  }, [facultyPreferences, studentPreferences])

  // Clear all preferences
  const clearPreferences = useCallback(async () => {
    await setDoc(doc(db, 'preferences', 'faculty'), {});
    await setDoc(doc(db, 'preferences', 'students'), {});
    // Local states will be updated by Firestore listeners
  }, [])

  // Adapted saveFeedback for general user feedback
  const saveFeedback = useCallback(async (feedbackPayloadWithUser) => { // Expects { userId, userName, type, message, ... }
    try {
      const docRef = await addDoc(collection(db, 'userFeedbackEntries'), {
        ...feedbackPayloadWithUser, // contains userId, userName, type, message
        timestamp: new Date().toISOString(),
        status: 'new' // e.g., 'new', 'read', 'archived'
      });
      console.log('Feedback saved with ID:', docRef.id);

      // Send confirmation notification to the user who submitted feedback
      if (feedbackPayloadWithUser.userId) {
        addNotification({
          type: 'success',
          category: 'feedback',
          title: 'Feedback Submitted',
          message: 'Thank you for your feedback. We will review it shortly.',
          timestamp: new Date().toISOString(),
          feedbackId: docRef.id
        }, feedbackPayloadWithUser.userId);
      }

      // Notify Admin(s) with special popup
      const adminRecipientId = 'admin1'; // Replace with actual admin ID
      addNotification({
        type: 'info',
        category: 'feedback', // Explicitly set category for special popup
        title: 'New User Feedback Received',
        message: feedbackPayloadWithUser.message,
        userName: feedbackPayloadWithUser.userName || 'Anonymous User',
        feedbackType: feedbackPayloadWithUser.type || 'General',
        feedbackId: docRef.id, // Store reference to the feedback document
      }, adminRecipientId);

      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error saving feedback:', error);
      return { success: false, error: error.message };
    }
  }, [addNotification]);

  // Get all feedback
  const getAllFeedback = useCallback(() => {
    return feedback
  }, [feedback])

  // Clear all feedback
  const clearFeedback = useCallback(async () => {
    try {
      const feedbackCollectionRef = collection(db, 'userFeedbackEntries');
      const feedbackSnapshot = await getDocs(feedbackCollectionRef);
      
      if (feedbackSnapshot.empty) {
        console.log('No feedback entries to clear.');
        setFeedback([]); // Ensure local state is also cleared if remote is empty
        addNotification({ type: 'info', title: 'Feedback Cleared', message: 'There was no feedback to clear.' }, currentUser?.id || 'system');
        return;
      }

      const deletePromises = feedbackSnapshot.docs.map(docSnapshot => deleteDoc(docSnapshot.ref));
      await Promise.all(deletePromises);
      
      setFeedback([]); // Clear local state immediately after successful deletion
      console.log('All feedback entries cleared successfully from Firestore and local state.');
      addNotification({ type: 'success', title: 'Feedback Cleared', message: 'All user feedback has been cleared.' }, currentUser?.id || 'system');
    } catch (error) {
      console.error('Error clearing feedback:', error);
      addNotification({ type: 'error', title: 'Clear Feedback Error', message: `Failed to clear feedback: ${error.message}` }, currentUser?.id || 'system');
    }
  }, [addNotification, currentUser]);

  // Check if timetable is finalized
  const isFinalized = useCallback(() => {
    return finalized;
  }, [finalized]);

  // Set timetable as finalized in Firestore
  const setFinalized = useCallback(async (value) => {
    try {
      const timetableDocRef = doc(db, 'timetable', 'current');
      const singleDocSnap = await getDoc(timetableDocRef);

      const currentData = singleDocSnap.exists() ? singleDocSnap.data() : { entries: [], isApproved: false }; // Default if not exists

      await setDoc(timetableDocRef, {
        ...currentData, // Preserve existing entries and isApproved status
        isFinalized: value,
      });
      // Local state will be updated by the onSnapshot listener.
      addNotification({ title: `Timetable ${value ? 'Finalized' : 'Unfinalized'}`, message: `The timetable status has been updated.`, type: value ? 'success' : 'info' }, currentUser?.id || 'system');
    } catch (error) {
      console.error("Error updating finalized status:", error);
      addNotification({ title: 'Error', message: 'Failed to update timetable finalized status.', type: 'error' }, currentUser?.id || 'system');
    }
  }, [addNotification, currentUser]);

  // Check if timetable is approved
  const isApproved = useCallback(() => {
    return approved;
  }, [approved]);

  // Set timetable as approved in Firestore
  const setApproved = useCallback(async (value) => {
    try {
      const timetableDocRef = doc(db, 'timetable', 'current');
      const singleDocSnap = await getDoc(timetableDocRef);
      const currentData = singleDocSnap.exists() ? singleDocSnap.data() : { entries: [], isFinalized: false }; // Default if not exists

      await setDoc(timetableDocRef, {
        ...currentData, // Preserve existing entries and isFinalized status
        isApproved: value,
      });
      // Local state will be updated by the onSnapshot listener.
      addNotification({ title: `Timetable ${value ? 'Approved' : 'Unapproved'}`, message: `The timetable approval status has been updated.`, type: value ? 'success' : 'info' }, currentUser?.id || 'system');
    } catch (error) {
      console.error("Error updating approved status:", error);
      addNotification({ title: 'Error', message: 'Failed to update timetable approval status.', type: 'error' }, currentUser?.id || 'system');
    }
  }, [addNotification, currentUser]);

  // Function to convert 24-hour time to 12-hour AM/PM format
  const formatTime12Hour = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const h = parseInt(hours);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12; // Convert 0 to 12 for 12 AM/PM
    return `${h12}:${minutes} ${suffix}`;
  };

  // Function to store uploaded JSON data
  const storeUploadedSchedule = useCallback((items) => {
    if (Array.isArray(items)) {
      setUploadedScheduleItems(items);
      console.log('Uploaded schedule items stored in context:', items);
    } else {
      console.error('Failed to store uploaded schedule: items is not an array.', items);
      setUploadedScheduleItems([]); // Reset or handle error appropriately
    }
  }, []);

  // Timetable generation algorithm (update to save to Firestore and notify)
  const generateTimetable = useCallback(async (customPreferences = null) => {
    console.log('Generating timetable with customPrefs:', customPreferences);
    setGenerationWarnings([]);

    const resolvedPreferences = customPreferences || {
      faculty: facultyPreferences,
      student: studentPreferences,
    };

    // --- STAGE 1: Simulate Timetable Generation --- 
    // This is a placeholder for your actual generation logic.
    // Replace this with your algorithm that produces `finalTimetableEntries`.
    let simulatedEntries = [];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const times = ['09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '13:00-14:00', '14:00-15:00'];
    const tempSubjects = subjects.length > 0 ? subjects : [{ id: 'SUB101', name: 'Math 101' }, { id: 'SUB102', name: 'Physics 101' }];
    const tempTeachers = teachers.length > 0 ? teachers : [{ id: 'FAC1', name: 'Dr. Alpha' }, { id: 'FAC2', name: 'Prof. Beta' }];

    days.forEach(day => {
      times.forEach((time, index) => {
        if (Math.random() > 0.4) { // ~60% chance of being a class
          simulatedEntries.push({
            id: `${day}-${time}-${tempSubjects[index % tempSubjects.length].id}`.replace(/[^a-zA-Z0-9-]/g, ''), // Ensure valid ID
            day,
            time,
            subject: tempSubjects[index % tempSubjects.length].name,
            teacher: tempTeachers[index % tempTeachers.length].name,
            room: `R${100 + (index % 5) + 1}`,
            type: 'class'
          });
        } else {
          // Add a free period for variety if not a class
          simulatedEntries.push({
            id: `${day}-${time}-FREE`.replace(/[^a-zA-Z0-9-]/g, ''),
            day,
            time,
            type: 'free'
          });
        }
      });
    });
    // --- End of Simulation --- 

    const finalTimetableEntries = simulatedEntries; // Replace with your actual generated entries

    try {
      // Save the newly generated timetable to Firestore with initial status
      await setDoc(doc(db, 'timetable', 'current'), {
        entries: finalTimetableEntries,
        isFinalized: false, // Newly generated timetable is not finalized
        isApproved: false,  // And not approved
        lastGenerated: new Date().toISOString() // Optional: timestamp of generation
      });
      
      // No need to call setTimetableData, setFinalizedState, or setApprovedState locally.
      // The onSnapshot listener will pick up these changes and update the context state for all clients.

      addNotification({
        type: 'success',
        title: 'Timetable Generated',
        message: 'A new timetable has been successfully generated and saved.',
      }, currentUser?.id || 'system'); // Notify the current user (admin)

      // Return true or the generated entries if needed by the caller
      return { success: true, entries: finalTimetableEntries }; 

    } catch (error) {
      console.error('Error saving generated timetable to Firestore:', error);
      setGenerationWarnings(prev => [...prev, 'Failed to save the generated timetable.']);
      addNotification({
        type: 'error',
        title: 'Timetable Generation Error',
        message: 'Failed to save the newly generated timetable to the database.',
      }, currentUser?.id || 'system');
      return { success: false, error: error.message };
    }
  }, [facultyPreferences, studentPreferences, subjects, teachers, addNotification, currentUser]);

  const finalizeTimetable = useCallback(async () => {
    await setFinalized(true);
    // Notification is handled by setFinalized
    // If finalizing should also un-approve, add: await setApproved(false);
  }, [setFinalized /*, setApproved */]); // Assuming setFinalized is the new async one

  const approveTimetable = useCallback(async () => {
    if (finalized) { // 'finalized' is the reactive state from context, read by onSnapshot
      await setApproved(true);
      // Notification is handled by setApproved
    } else {
      addNotification({ type: 'warning', title: 'Approval Failed', message: 'Timetable must be finalized before it can be approved.' }, currentUser?.id || 'system');
    }
  }, [finalized, setApproved, addNotification, currentUser]);

  const unfinalizeTimetable = useCallback(async () => {
    await setFinalized(false);
    // If un-finalizing should also clear approval status:
    if (approved) { // 'approved' is the reactive state
      await setApproved(false);
    }
    // Notifications handled by setFinalized and setApproved
  }, [setFinalized, setApproved, approved, currentUser]);

  const unapproveTimetable = useCallback(async () => {
    await setApproved(false);
    // Notification is handled by setApproved
  }, [setApproved, currentUser]);

  // Placeholder: Fetch admin-specific timetable or related data
  const fetchAdminTimetable = useCallback(async () => {
    console.log('fetchAdminTimetable called (placeholder)');
    // In a real scenario, this might fetch additional admin-only views or settings
    // For now, it does nothing as the main timetable is already real-time via onSnapshot.
    return Promise.resolve({}); // Or some relevant placeholder data
  }, []);

  const value = useMemo(() => ({
    timetableData,
    setTimetableData,
    teachers,
    setTeachers,
    subjects,
    setSubjects,
    searchTerm,
    setSearchTerm,
    selectedDay,
    setSelectedDay,
    facultyPreferences,
    studentPreferences,
    feedback,
    finalized, // state variable
    isFinalized: finalized, // exposed as isFinalized
    approved,  // state variable
    isApproved: approved,  // exposed as isApproved
    currentUser,
    setCurrentUser,
    lastTimetableUpdate,
    setLastTimetableUpdate,
    generationWarnings,
    setGenerationWarnings,
    uploadedScheduleItems,

    // Functions from context
    addEntry,
    updateEntry,
    deleteEntry,
    importData,
    exportData,
    saveFacultyPreference,
    saveStudentPreference,
    getAllPreferences,
    clearPreferences,
    saveFeedback,
    getAllFeedback,
    clearFeedback,
    setFinalized, // async function, should be useCallback'd
    setApproved,  // async function, should be useCallback'd
    finalizeTimetable,
    approveTimetable,
    unfinalizeTimetable,
    unapproveTimetable,
    generateTimetable,
    formatTime12Hour,
    storeUploadedSchedule,
    fetchAdminTimetable,
    notifications,
    addNotification,
    dismissNotification,
  }), [
    timetableData, setTimetableData, teachers, setTeachers, subjects, setSubjects,
    searchTerm, setSearchTerm, selectedDay, setSelectedDay, facultyPreferences,
    studentPreferences, feedback, finalized, approved, currentUser, setCurrentUser,
    lastTimetableUpdate, setLastTimetableUpdate, generationWarnings, setGenerationWarnings,
    uploadedScheduleItems, addEntry, updateEntry, deleteEntry, importData, exportData,
    saveFacultyPreference, saveStudentPreference, getAllPreferences, clearPreferences,
    saveFeedback, getAllFeedback, clearFeedback, setFinalized, setApproved,
    finalizeTimetable, approveTimetable, unfinalizeTimetable, unapproveTimetable,
    generateTimetable, formatTime12Hour, storeUploadedSchedule, fetchAdminTimetable,
    notifications, addNotification, dismissNotification
  ]);

  return (
    <TimetableContext.Provider value={value}>
      {children}
    </TimetableContext.Provider>
  )
};

export { TimetableContext, TimetableProvider, useTimetable };