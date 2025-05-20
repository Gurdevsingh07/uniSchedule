/**
 * Authentication service for handling user data
 * Uses localStorage to persist user data in JSON format
 */

// Key used for localStorage
const USER_STORAGE_KEY = 'college_timetable_users';
const CURRENT_USER_KEY = 'college_timetable_current_user';

/**
 * Get all registered users from localStorage
 * @returns {Array} Array of user objects
 */
export const getUsers = () => {
  const users = localStorage.getItem(USER_STORAGE_KEY);
  return users ? JSON.parse(users) : [];
};

/**
 * Save users array to localStorage
 * @param {Array} users Array of user objects
 */
export const saveUsers = (users) => {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
};

/**
 * Ensures demo user exists in the database
 * Creates the demo user if it doesn't exist
 */
export const ensureDemoUser = () => {
  const users = getUsers();
  const demoUserExists = users.some(user => user.email === 'demo@example.com');
  
  if (!demoUserExists) {
    const demoUser = {
      id: 'demo-user',
      name: 'Demo User',
      email: 'demo@example.com',
      password: 'password',
      createdAt: new Date().toISOString()
    };
    
    saveUsers([...users, demoUser]);
  }
  
  return { email: 'demo@example.com', password: 'password' };
};

/**
 * Register a new user
 * @param {Object} userData User data object (name, email, password)
 * @returns {Object} Result with success flag and message
 */
export const registerUser = (userData) => {
  try {
    // Make sure demo user exists
    ensureDemoUser();
    
    const users = getUsers();
    
    // Check if email already exists
    if (users.some(user => user.email === userData.email)) {
      return { success: false, message: 'Email already registered' };
    }
    
    // Create user object (without storing raw password)
    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      // In a real app, you'd hash the password
      password: userData.password,
      createdAt: new Date().toISOString()
    };
    
    // Save to localStorage
    saveUsers([...users, newUser]);
    
    return { success: true, message: 'Registration successful' };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: 'Registration failed' };
  }
};

/**
 * Login a user
 * @param {string} email User email
 * @param {string} password User password
 * @returns {Object} Result with success flag, message and user data (if successful)
 */
export const loginUser = (email, password) => {
  try {
    // Make sure demo user exists
    ensureDemoUser();
    
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return { success: false, message: 'Invalid email or password' };
    }
    
    // Store current user in localStorage (without password)
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({
      ...userWithoutPassword,
      lastLogin: new Date().toISOString()
    }));
    
    return { 
      success: true, 
      message: 'Login successful',
      user: userWithoutPassword
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Login failed' };
  }
};

/**
 * Get the current logged in user
 * @returns {Object|null} Current user object or null if not logged in
 */
export const getCurrentUser = () => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

/**
 * Check if user is logged in
 * @returns {boolean} True if user is logged in
 */
export const isLoggedIn = () => {
  return !!getCurrentUser();
};

/**
 * Logout the current user
 */
export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
}; 