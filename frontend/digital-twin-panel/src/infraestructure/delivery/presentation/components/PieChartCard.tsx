import { ChartDataset, TooltipItem } from "chart.js";
import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDeferred from "chartjs-plugin-deferred";
import { CardAnalysisSkeleton } from "./CardAnalysisSkeleton";
import { ChartDataOptions } from "../../../../core/Domain";
import { getColorList } from "../../PortsImpl";

type Props = {
  options: ChartDataOptions;
};

ChartJS.register(ArcElement, Tooltip, Legend);

export const PieChartCard = ({ options }: Props) => {
  const [selectedOption, setSelectedOption] = useState<string>("");

  useEffect(() => {
    setSelectedOption(options?.keys().next().value);
  }, [options]);

  if (options.size === 0) {
    return <CardAnalysisSkeleton />;
  }

  const { labels, values } = options?.get(selectedOption) ?? {
    labels: [],
    values: [],
  };

  var labelNames: string[] = [];
  var labelColors: string[] = [];
  labels.forEach(({ name, color }) => {
    labelNames = [...labelNames, name];
    labelColors = [...labelColors, color];
  });

  var dataset: ChartDataset<"doughnut", number[]>[] = [];
  dataset = [
    {
      label: "",
      borderRadius: 6,
      spacing: 2,
      backgroundColor: labelColors,
      data: values,
    },
  ];
  return (
    <div className="card-analysis mb-16">
      <select
        onChange={(e) => setSelectedOption(e.currentTarget.value)}
        value={selectedOption}
      >
        {Array.from(options?.keys()).map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <Doughnut
        style={{
          maxHeight: "200px",
        }}
        className="mt-8"
        plugins={[ChartDeferred]}
        options={{
          plugins: {
            tooltip: {
              callbacks: {
                label: function (tooltipItem: TooltipItem<"doughnut">) {
                  return tooltipItem.label;
                },
              },
            },
            legend: {
              display: false,
              position: "right",
              labels: {
                usePointStyle: true,
                pointStyle: "rectRounded",
                boxWidth: 10,
                font: {
                  size: 14,
                },
              },
            },
            deferred: {
              xOffset: 100,
              yOffset: "40%",
              delay: 200,
            },
          },
        }}
        data={{
          labels: labelNames,
          datasets: dataset,
        }}
      />
    </div>
  );
};
