import React, { useState } from "react";
import { DEFAULT_PHASE, PHASES, PhasesContext } from "./contexts";

export const PhasesContextWrapper = ({ children }) => {
  const [currentPhase, setPhase] = useState(DEFAULT_PHASE);

  const actions = {
    setCurrentPhase: (newPhase) => {
      setPhase(newPhase);
    },
  };

  return (
    <PhasesContext.Provider value={{ currentPhase, actions, phases: PHASES }}>
      {children}
    </PhasesContext.Provider>
  );
};
