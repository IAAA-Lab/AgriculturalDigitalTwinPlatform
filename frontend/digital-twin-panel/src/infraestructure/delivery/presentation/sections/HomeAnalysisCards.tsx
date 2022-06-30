import classNames from "classnames";
import { useState } from "react";
import { AreasPerUser } from "../../../../core/Domain";
import { LineChartCard } from "../components/LineChartCard";
import { PieChartCard } from "../components/PieChartCard";

type Props = {
  data?: AreasPerUser;
};

export const HomeAnalysisCards = ({ data }: Props) => {
  const [openSummary, setOpenSummary] = useState(false);
  const [openHistoric, setOpenHistoric] = useState(false);

  const classesSummary = classNames(
    "dropdown-content",
    openSummary && "off-is-active"
  );

  const classHistoric = classNames(
    "dropdown-content",
    openHistoric && "off-is-active"
  );

  return (
    <>
      <div className="dropdown-analysis">
        <div
          className="dropdown-header"
          onClick={() => setOpenSummary(!openSummary)}
        >
          <div className="row space-between reveal-from-left">
            <div className="col">
              <h3 className="m-0">Resumen actual</h3>
              <p className="text-sm mb-8">
                Actualizaciones al momento del estado de los campos
              </p>
            </div>
          </div>
        </div>
        <div className={classesSummary}>
          <div className="card-analysis-wrapper">
            <PieChartCard data={data} />
          </div>
        </div>
      </div>
      <div className="dropdown-analysis">
        <div
          className="dropdown-header"
          onClick={() => setOpenHistoric(!openHistoric)}
        >
          <div className="row space-between reveal-from-left">
            <div className="col">
              <h3 className="m-0">Histórico</h3>
              <p className="text-sm mb-8">Datos históricos de los campos</p>
            </div>
          </div>
        </div>
        <div className={classHistoric}>
          <LineChartCard data={data} />
          <PieChartCard data={data} />
        </div>
      </div>
    </>
  );
};
