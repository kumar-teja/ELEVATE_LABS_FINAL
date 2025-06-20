import { createContext, useState, useContext, useEffect } from 'react';

// Create the context
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Retrieve the user data from sessionStorage if it exists
    const savedUser = sessionStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : { userName: '', firstName: '' };
  });

  // Use useEffect to update sessionStorage whenever the user state changes
  useEffect(() => {
    if (user.userName && user.firstName) {
      sessionStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('user');
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
