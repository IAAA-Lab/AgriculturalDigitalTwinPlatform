import classNames from "classnames";
import { useState } from "react";
import {
  ChartDataOptions,
  Parcel,
  Result,
  TableDataOptions,
} from "../../../../../core/Domain";
import { getColorList, numberWithCommas } from "../../../PortsImpl";
import { CharsTable } from "../../components/CharsTable";
import { LineChartCard } from "../../components/LineChartCard";
import { PieChartCard } from "../../components/PieChartCard";

type Props = {
  data?: Result<Parcel[]>;
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

  if (data?.isError) {
    return <></>;
  }

  var chartDataOptions: ChartDataOptions = new Map();
  var tableDataOptions: TableDataOptions = [];
  const colors = getColorList(data?.data.length ?? 0);

  data?.data.forEach((e, i) => {
    tableDataOptions = [
      ...tableDataOptions,
      {
        key: { name: e.id, color: colors[i] },
        values: e.historic.commons ?? [],
      },
    ];
    e.historic.commons?.forEach((c) => {
      var { labels, values } = chartDataOptions.get(c.name) ?? {
        labels: [],
        values: [],
      };
      labels = [
        ...labels,
        {
          name: `${e.id} · ${numberWithCommas(c.value)} ${c.unit}`,
          color: colors[i],
        },
      ];
      values = [...values, c.value];
      chartDataOptions.set(c.name, { labels, values });
    });
  });

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
            <CharsTable data={tableDataOptions} />
          </div>
          <div className="card-analysis-wrapper">
            <PieChartCard options={chartDataOptions} />
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
          {/* <LineChartCard data={data} /> */}
          <PieChartCard options={chartDataOptions} />
        </div>
      </div>
    </>
  );
};
