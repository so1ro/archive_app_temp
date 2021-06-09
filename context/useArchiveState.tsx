import { useEffect, useState, createContext, useContext } from 'react';

export const ArchiveStateContext = createContext(null);

export const ArchiveStateProvider = (props) => {

  // State
  const [{ isAutoplay }, setIsAutoplay] = useState<{ isAutoplay: boolean }>({ isAutoplay: false })
  const [{ searchKeyword }, setSearchKeyword] = useState<{ searchKeyword: string }>({ searchKeyword: '' })
  const [{ isSeaching }, setIsSeaching] = useState<{ isSeaching: boolean }>({ isSeaching: false })
  const [{ searchedArchiveResult }, setSearchedArchiveResult] = useState<{ searchedArchiveResult: SearchedArchiveResultInterface[] }>({ searchedArchiveResult: [] })
  const [{ isVideoMode }, setIsVideoMode] = useState<{ isVideoMode: boolean }>({ isVideoMode: false })
  const [{ isArchiveDesc }, setIsArchiveDesc] = useState<{ isArchiveDesc: boolean }>({ isArchiveDesc: true })
  const [{ currentDisplayArchive }, setCurrentDisplayArchive] = useState<{ currentDisplayArchive: AllArchivesInterface | null }>({ currentDisplayArchive: null })

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
    setSearchedArchiveResult,
    isVideoMode,
    setIsVideoMode,
    isArchiveDesc,
    setIsArchiveDesc,
    currentDisplayArchive,
    setCurrentDisplayArchive,
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