import { createContext } from "react";

const AuthContext = createContext({ role: "default", logged: false });

const PHASES = [
  {
    title: "Fase 1",
    key: "phase1",
    stateKey: "under-construction",
    state: "En construcción",
  },
  {
    title: "Fase 2",
    key: "phase2",
    stateKey: "under-construction",
    state: "En construcción",
  },
  // {
  //   title: "Fase 3",
  //   key: "phase3",
  //   stateKey: "coming-soon",
  //   state: "Coming soon",
  // },
];

const PhasesContext = createContext({
  phases: [],
  currentPhase: 0,
  actions: {
    setCurrentPhase: () => {},
  },
});

export default AuthContext;
export { PhasesContext, PHASES };
export const DEFAULT_USER = { role: "default", logged: false };
export const DEFAULT_PHASE = 0;
