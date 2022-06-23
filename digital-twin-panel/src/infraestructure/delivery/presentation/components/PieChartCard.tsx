import { ChartDataset, TooltipItem, TooltipModel } from "chart.js";
import { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { numberWithCommas } from "../../PortsImpl";
import Skeleton from "react-loading-skeleton";
import ChartDeferred from "chartjs-plugin-deferred";
import { CardAnalysisSkeleton } from "./CardAnalysisSkeleton";

type Props = {
  data?: AreasPerUser;
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

ChartJS.register(ArcElement, Tooltip, Legend);

export const PieChartCard = ({ data }: Props) => {
  const [selectedOption, setSelectedOption] = useState<string>();

  useEffect(() => {
    setSelectedOption(data?.features.distinctCharacteristics[0]);
  }, [data]);

  if (!data) {
    return <CardAnalysisSkeleton />;
  }

  var labels: string[] = [];
  var dataset: ChartDataset<"doughnut", number[]>[] = [];

  dataset = [
    {
      label: "",
      borderRadius: 6,
      spacing: 2,
      backgroundColor: COLORS,
      data: data!.areas.flatMap((area) => {
        return area.characteristics
          .filter((feature) => {
            return feature.name === selectedOption;
          })
          .map((feature) => {
            labels = [
              ...labels,
              `${area.name} - ${numberWithCommas(feature.value)} ${
                feature.unit ?? ""
              }`,
            ];
            return feature.value;
          });
      }),
    },
  ];

  return (
    <div className="card-analysis reveal-from-right mb-16 col">
      <select
        onChange={(e) => setSelectedOption(e.currentTarget.value)}
        value={selectedOption}
      >
        {data!.features.distinctCharacteristics.map((e, i) => (
          <option key={i} value={e}>
            {e}
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
              display: window.innerWidth > 400,
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
          labels: labels,
          datasets: dataset,
        }}
      />
    </div>
  );
};
