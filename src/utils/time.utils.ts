import { Race, Session } from "../models";

export const isRaceFinished = (race: Race | null) =>
  race ? new Date(race.date).getTime() < Date.now() : false;

export const isRaceToday = (race: Race | null) => {
  if (!race) return false;
  const date = new Date(race.date);
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
};

export const isRaceTomorrow = (race: Race | null) => {
  if (!race) return false;
  const date = new Date(race.date);
  const now = new Date();
  return (
    date.getDate() === now.getDate() + 1 &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
};

export const getNextSession = (race: Race | null): Session | null => {
  if (!race) return null;

  const sessionKeys: [keyof Race, string][] = [
    ["FirstPractice", "FP1"],
    ["SecondPractice", "FP2"],
    ["ThirdPractice", "FP3"],
    ["SprintQualifying", "Sprint Qualifying"],
    ["Sprint", "Sprint"],
    ["Qualifying", "Qualifying"],
    ["date", "Race"],
  ];

  const now = new Date();
  const currentYear = now.getFullYear();

  for (const [key, label] of sessionKeys) {
    const session = race[key] as { date?: string; time?: string } | undefined;

    if (!session?.date || !session?.time) continue;

    const [monthStr, dayStr] = session.date.split("-");
    const [hourStr, minuteStr] = session.time.split(":");

    const month = Number(monthStr?.trim());
    const day = Number(dayStr?.trim());
    const hour = Number(hourStr?.trim());
    const minute = Number(minuteStr?.trim());

    if (isNaN(month) || isNaN(day) || isNaN(hour) || isNaN(minute)) {
      console.warn("Invalid session date/time format:", { session });
      continue;
    }

    const sessionDate = new Date(currentYear, month - 1, day, hour, minute);

    if (sessionDate.getTime() > now.getTime()) {
      return {
        name: label,
        date: session.date,
        time: session.time,
      };
    }
  }

  return null;
};

export const isSessionFinished = (date?: string, time?: string) => {
  if (!date || !time) return false;

  const now = new Date();
  const currentYear = now.getFullYear();

  const [month, day] = date.split("/").map(Number);
  const [hours, minutes] = time.split(":").map(Number);

  const sessionDate = new Date(currentYear, month - 1, day, hours, minutes);

  return sessionDate.getTime() < now.getTime();
};

export const isSeasonFinished = (season: number) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  return season < currentYear;
};

export const getRemainingTime = (target: Date | null) => {
  if (!target || isNaN(target.getTime())) return null;

  const total = target.getTime() - Date.now();

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return { total, days, hours, minutes, seconds };
};

export const formatRemainingTime = (t: {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}) => {
  const pad = (n: number) => String(n).padStart(2, "0");

  if (t.days > 0) {
    return `${t.days}:${pad(t.hours)}:${pad(t.minutes)}:${pad(t.seconds)}`;
  }

  return `${pad(t.hours)}:${pad(t.minutes)}:${pad(t.seconds)}`;
};
