import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  data?: AreasPerUser;
};

export const LineChartCard = ({ data }: Props) => {
  const [selectedOption, setSelectedOption] = useState<string>();

  useEffect(() => {
    setSelectedOption(data?.features.distinctCharacteristics[0]);
  }, [data]);

  const dataChart = data?.areas.flatMap((area) =>
    area.characteristics.flatMap((feature) => {
      return feature.name === selectedOption
        ? {
            name: area.name,
            value: feature.value,
          }
        : [];
    })
  );

  return (
    <div className="card-analysis reveal-from-bottom mb-16 col">
      <select
        onChange={(e) => setSelectedOption(e.currentTarget.value)}
        value={selectedOption}
      >
        {data?.features.distinctCharacteristics.map((e, i) => (
          <option key={i} value={e}>
            {e}
          </option>
        ))}
      </select>
      <ResponsiveContainer width={"100%"} height={"100%"}>
        <LineChart
          data={dataChart}
          margin={{
            top: 5,
            right: 20,
            left: 0,
            bottom: 5,
          }}
        >
          <XAxis dataKey="name" fontSize={14} />
          <YAxis fontSize={14} />
          <Tooltip
            labelStyle={{
              fontSize: 16,
            }}
            itemStyle={{
              fontSize: 14,
              padding: "0px",
            }}
            contentStyle={{
              padding: "0px 10px 0px 10px",
              borderRadius: "10px",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
