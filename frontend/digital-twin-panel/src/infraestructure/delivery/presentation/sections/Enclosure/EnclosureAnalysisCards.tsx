import classNames from "classnames";
import { useState } from "react";
import {
  ChartDataOptions,
  Enclosure,
  Result,
} from "../../../../../core/Domain";
import { getColorList, numberWithCommas } from "../../../PortsImpl";
import { CardAnalysisSkeleton } from "../../components/CardAnalysisSkeleton";
import { CharsTable } from "../../components/CharsTable";
import { PieChartCard } from "../../components/PieChartCard";

type Props = {
  data?: Enclosure;
};

export const EnclosureAnalysisCards = ({ data }: Props) => {
  const [openHistoric, setOpenHistoric] = useState(false);

  const classHistoric = classNames(
    "dropdown-content",
    openHistoric && "off-is-active"
  );

  if (!data) {
    return <CardAnalysisSkeleton />;
  }

  var chartDataOptions: ChartDataOptions = new Map();
  const colors = getColorList(1);

  data?.info.characteristics?.forEach((c) => {
    var { labels, values } = chartDataOptions.get(c.name) ?? {
      labels: [],
      values: [],
    };
    labels = [
      ...labels,
      {
        name: `${data?.id} - ${numberWithCommas(c.value)} ${c.unit}`,
        color: colors[0],
      },
    ];
    values = [...values, c.value];
    chartDataOptions.set(c.name, { labels, values });
  });

  return (
    <>
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
          {/* <LineChartCard data={data} /> */}
          <PieChartCard options={chartDataOptions} />
        </div>
      </div>
    </>
  );
};
