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
  if (!data) {
    return <CardAnalysisSkeleton />;
  }

  var chartDataOptions: ChartDataOptions = new Map();
  const colors = getColorList(data.info.crops?.length ?? 0);

  data?.info.crops?.forEach((e, i) => {
    e.characteristics?.forEach((c) => {
      var { labels, values } = chartDataOptions.get(c.name) ?? {
        labels: [],
        values: [],
      };
      labels = [
        ...labels,
        {
          name: ` ${e.name} · ${numberWithCommas(c.value)} ${c.unit ?? ""}`,
          color: colors[i],
        },
      ];
      values = [...values, c.value];
      chartDataOptions.set(c.name, { labels, values });
    });
  });
  return (
    <>
      {/* <LineChartCard data={data} /> */}
      <PieChartCard options={chartDataOptions} />
    </>
  );
};
