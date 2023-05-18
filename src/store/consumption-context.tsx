import React, { createContext, useState } from "react";
import { Props } from "../interfaces/common-interfaces";


type ConsumptionContextType = {
  dailyConsumption: any[],
  weeklyConsumption: any[],
  monthlyConsumption: any[],
  setDailyConsumption: (dailyConsumption: any[]) => void,
  setWeeklyConsumption: (weeklyConsumption: any[]) => void,
  setMonthlyConsumption: (monthlyConsumption: any[]) => void,
  clearAllConsumption: () => void
};

export const ConsumptionContext = createContext<ConsumptionContextType>({
  dailyConsumption: [],
  weeklyConsumption: [],
  monthlyConsumption: [],
  setDailyConsumption: (dailyConsumption: any[]) => { },
  setWeeklyConsumption: (weeklyConsumption: any[]) => { },
  setMonthlyConsumption: (monthlyConsumption: any[]) => { },
  clearAllConsumption: () => {}
});

export default function UserContextProvider({ children }: Props) {
  const [dailyConsumptionState, setDailyConsumptionState] = useState([] as any);
  const [weeklyConsumptionState, setWeeklyConsumptionState] = useState([] as any);
  const [monthlyConsumptionState, setMonthlyConsumptionState] = useState([] as any);

  function setDailyConsumption(dailyConsumption: any[]) {
    setDailyConsumptionState(dailyConsumption);
  }

  function setWeeklyConsumption(weeklyConsumption: any[]) {
    setWeeklyConsumptionState(weeklyConsumption);
  }

  function setMonthlyConsumption(monthlyConsumption: any[]) {
    setMonthlyConsumptionState(monthlyConsumption);
  }

  function clearAllConsumption() {
    setDailyConsumptionState([]);
    setWeeklyConsumptionState([]);
    setMonthlyConsumptionState([]);
  }

  const value = {
    dailyConsumption: dailyConsumptionState,
    weeklyConsumption: weeklyConsumptionState,
    monthlyConsumption: monthlyConsumptionState,
    setDailyConsumption: setDailyConsumption,
    setWeeklyConsumption: setWeeklyConsumption,
    setMonthlyConsumption: setMonthlyConsumption,
    clearAllConsumption: clearAllConsumption
  };

  return (
    <ConsumptionContext.Provider value={value}>
    {children}
    </ConsumptionContext.Provider>
  );
}