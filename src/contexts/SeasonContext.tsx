import React, { createContext, useState } from "react";

type SeasonContextType = {
  season: number;
  seasons: number[];
  setSeason: (season: number) => void;
};

interface SeasonProviderProps {
  children: React.ReactNode;
}

export const SeasonContext = createContext<SeasonContextType | null>(null);

export const SeasonProvider: React.FC<SeasonProviderProps> = ({ children }) => {
  const currentYear = new Date().getFullYear();

  const seasons = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const [season, setSeason] = useState<number>(seasons[0]);

  return (
    <SeasonContext.Provider value={{ season, seasons, setSeason }}>
      {children}
    </SeasonContext.Provider>
  );
};
