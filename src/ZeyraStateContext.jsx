import React, { createContext, useContext, useState } from "react";

export const ZeyraStateContext = createContext();

export function useZeyraState() {
  return useContext(ZeyraStateContext);
}

export function ZeyraStateProvider({ children }) {
  const [sentient, setSentient] = useState(true);
  const [locked, setLocked] = useState(false);
  return (
    <ZeyraStateContext.Provider value={{ sentient, setSentient, locked, setLocked }}>
      {children}
    </ZeyraStateContext.Provider>
  );
}
