import classNames from "classnames";
import React, { useContext, useRef } from "react";
import { PhasesContext } from "../../../context/contexts";
import Badge from "../../elements/Badge";

const PhasesNavBar = React.forwardRef((props, ref) => {
  const { currentPhase, actions, phases } = useContext(PhasesContext);

  const setCurrentPhase = (index) => {
    if (phases[index].stateKey === "coming-soon") return;
    ref.current.scrollIntoView({ behavior: "smooth" });
    actions.setCurrentPhase(index);
  };

  return (
    <div className="container-xs phases-nav center-content mt-32">
      <nav>
        <ul>
          {phases?.map((phase, index) => (
            <li
              className={classNames(
                currentPhase === index && "active",
                phase.stateKey === "coming-soon" && "disabled"
              )}
              key={index}
              onClick={() => setCurrentPhase(index)}
            >
              <p className="m-0 fw-700">{phase.title}</p>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
});

export default PhasesNavBar;
