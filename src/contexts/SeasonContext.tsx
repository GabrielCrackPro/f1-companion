import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { useNavigation } from "@react-navigation/native";
import React, {
  createContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { RaceNavigationProp } from "../models";

type SeasonContextType = {
  season: number;
  seasons: number[];
  seasonSelectorOpen: boolean;
  seasonSelectorRef: RefObject<BottomSheetMethods | null>;
  setSeason: (season: number) => void;
  openSeasonSelector: () => void;
  closeSeasonSelector: () => void;
  handleSeasonSelect: (season: number) => void;
  goToSeasonResults: () => void;
};

export const SeasonContext = createContext<SeasonContextType | null>(null);

interface SeasonProviderProps {
  children: ReactNode;
}

export const SeasonProvider: React.FC<SeasonProviderProps> = ({ children }) => {
  const { navigate } = useNavigation<RaceNavigationProp>();

  const currentYear = new Date().getFullYear();

  const seasons = useMemo(
    () => Array.from({ length: 5 }, (_, i) => currentYear - i),
    [currentYear]
  );

  const [season, setSeason] = useState(seasons[0]);
  const [seasonSelectorOpen, setSeasonSelectorOpen] = useState(false);

  const bottomSheetRef = useRef<BottomSheetMethods | null>(null);

  const openSeasonSelector = () => {
    bottomSheetRef.current?.expand();
    setSeasonSelectorOpen(true);
  };

  const closeSeasonSelector = () => {
    bottomSheetRef.current?.close();
    setSeasonSelectorOpen(false);
  };

  const handleSeasonSelect = (selected: number) => {
    setSeason(selected);
    closeSeasonSelector();
  };

  const goToSeasonResults = () => {
    navigate("SeasonResults", { season });
  };

  const value: SeasonContextType = {
    season,
    seasons,
    seasonSelectorOpen,
    seasonSelectorRef: bottomSheetRef,
    setSeason,
    openSeasonSelector,
    closeSeasonSelector,
    handleSeasonSelect,
    goToSeasonResults,
  };

  return (
    <SeasonContext.Provider value={value}>{children}</SeasonContext.Provider>
  );
};
