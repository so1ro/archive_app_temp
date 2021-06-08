import { useEffect, useState, createContext, useContext } from 'react';

export const ArchiveStateContext = createContext(null);

export const ArchiveStateProvider = (props) => {

  // State
  const [{ isAutoplay }, setIsAutoplay] = useState<{ isAutoplay: boolean }>({ isAutoplay: false })

  useEffect(() => {

  }, []);

  const value = {
    isAutoplay,
    setIsAutoplay
  }
  return <ArchiveStateContext.Provider value={value} {...props} />;
};

export const useArchiveState = () => {
  const context = useContext(ArchiveStateContext);
  if (context === undefined) {
    throw new Error(`useArchiveState must be used within a ArchiveStateProvider.`);
  }
  return context;
};