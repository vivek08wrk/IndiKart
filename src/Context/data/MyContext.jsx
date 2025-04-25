import React, { createContext, useState } from 'react';

const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <MyContext.Provider value={{ loading, setLoading }}>
      {children}
    </MyContext.Provider>
  );
};

export default MyContext;
