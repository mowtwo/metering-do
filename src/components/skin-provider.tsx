"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  type SkinId,
  DEFAULT_SKIN,
  resolveSkinId,
  SKIN_STORAGE_KEY,
} from "@/lib/skins";

interface SkinContextValue {
  skin: SkinId;
  setSkin: (skin: SkinId) => void;
}

const SkinContext = createContext<SkinContextValue>({
  skin: DEFAULT_SKIN,
  setSkin: () => {},
});

export function useSkin() {
  return useContext(SkinContext);
}

interface SkinProviderProps {
  children: React.ReactNode;
}

export function SkinProvider({ children }: SkinProviderProps) {
  const [skin, setSkinState] = useState<SkinId>(() => {
    if (typeof window !== "undefined") {
      return resolveSkinId(localStorage.getItem(SKIN_STORAGE_KEY));
    }
    return DEFAULT_SKIN;
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-skin", skin);
  }, [skin]);

  const setSkin = useCallback((newSkin: SkinId) => {
    setSkinState(newSkin);
    localStorage.setItem(SKIN_STORAGE_KEY, newSkin);
  }, []);

  return (
    <SkinContext.Provider value={{ skin, setSkin }}>
      {children}
    </SkinContext.Provider>
  );
}
