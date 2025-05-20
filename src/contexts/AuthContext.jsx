import { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser, isLoggedIn, logoutUser } from '../utils/authService';

// Create the auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component to wrap the app
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is already logged in
    if (isLoggedIn()) {
      setCurrentUser(getCurrentUser());
    }
    setLoading(false);
  }, []);
  
  // Update user data when authentication state changes
  const updateUserData = () => {
    if (isLoggedIn()) {
      setCurrentUser(getCurrentUser());
    } else {
      setCurrentUser(null);
    }
  };
  
  // Logout function
  const logout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  // Check if user has a specific role
  const hasRole = (role) => {
    if (!currentUser) return false;
    return currentUser.role === role;
  };

  // User role helpers
  const isStudent = () => hasRole('student');
  const isFaculty = () => hasRole('faculty');
  const isAdmin = () => hasRole('administrator');
  const isITSupport = () => hasRole('it-support');
  
  // Context value
  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    updateUserData,
    logout,
    hasRole,
    isStudent,
    isFaculty,
    isAdmin,
    isITSupport
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 