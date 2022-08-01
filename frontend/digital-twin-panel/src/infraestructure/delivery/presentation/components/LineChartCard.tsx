import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { CardAnalysisSkeleton } from "./CardAnalysisSkeleton";
import { Parcel } from "../../../../core/Domain";

type Props = {
  data?: Parcel;
};

ChartJS.register(
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  LinearScale,
  PointElement,
  LineElement
);

export const LineChartCard = ({ data }: Props) => {
  const [selectedOption, setSelectedOption] = useState<string>();

  useEffect(() => {
    //setSelectedOption(data?.features.distinctCharacteristics[0]);
  }, [data]);

  if (!data) {
    return <CardAnalysisSkeleton />;
  }

  //  const dataChart = data?.areas.flatMap((area) =>
  //     area.characteristics.flatMap((feature) => {
  //       return feature.name === selectedOption
  //         ? {
  //             name: area.name,
  //             value: feature.value,
  //           }
  //         : [];
  //     })
  //   );

  //   return (
  //     <div className="card-analysis reveal-from-right mb-16 col">
  //       <select
  //         onChange={(e) => setSelectedOption(e.currentTarget.value)}
  //         value={selectedOption}
  //       >
  //         {data?.features.distinctCharacteristics.map((e, i) => (
  //           <option key={i} value={e}>
  //             {e}
  //           </option>
  //         ))}
  //       </select>
  //       <Line
  //         data={{
  //           labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  //           datasets: [
  //             {
  //               label: "First dataset",
  //               data: [33, 53, 85, 41, 44, 65],
  //               fill: true,
  //               backgroundColor: "rgba(75,192,192,0.2)",
  //               borderColor: "rgba(75,192,192,1)",
  //             },
  //             {
  //               label: "Second dataset",
  //               data: [33, 25, 35, 51, 54, 76],
  //               fill: true,
  //               backgroundColor: "rgba(255,99,132,0.2)",
  //               borderColor: "#742774",
  //             },
  //             {
  //               label: "Third dataset",
  //               data: [45, 25, 102, 51, 23, 7],
  //               fill: false,
  //               borderColor: "#4D4D4D",
  //             },
  //             {
  //               label: "Third dataset",
  //               data: [2, 4, 345, 23, 76, 92],
  //               fill: false,
  //               borderColor: "#1F1F1F",
  //             },
  //           ],
  //         }}
  //         style={{
  //           maxHeight: "300px",
  //         }}
  //         options={{
  //           aspectRatio: 4 / 3,
  //           plugins: {
  //             legend: {
  //               display: window.innerWidth > 400,
  //               position: "right",
  //               labels: {
  //                 usePointStyle: true,
  //                 pointStyle: "rectRounded",
  //                 boxWidth: 10,
  //               },
  //             },
  //           },
  //           scales: {
  //             x: {
  //               ticks: {},
  //             },
  //           },
  //         }}
  //       />
  //     </div>
  //   )
};
