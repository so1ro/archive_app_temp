import { useEffect, useState, createContext, useContext } from 'react';

export const ArchiveStateContext = createContext(null);

export const ArchiveStateProvider = (props) => {

  // State
  const [{ isAutoplay }, setIsAutoplay] = useState<{ isAutoplay: boolean }>({ isAutoplay: false })
  const [{ searchKeyword }, setSearchKeyword] = useState<{ searchKeyword: string }>({ searchKeyword: '' })
  const [{ isSeaching }, setIsSeaching] = useState<{ isSeaching: boolean }>({ isSeaching: false })
  const [{ searchedArchiveResult }, setSearchedArchiveResult] = useState<{ searchedArchiveResult: SearchedArchiveResultInterface[] }>({ searchedArchiveResult: [] })

  // Effect
  // useEffect(() => { }, []);

  const value = {
    isAutoplay,
    setIsAutoplay,
    searchKeyword,
    setSearchKeyword,
    isSeaching,
    setIsSeaching,
    searchedArchiveResult,
    setSearchedArchiveResult
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