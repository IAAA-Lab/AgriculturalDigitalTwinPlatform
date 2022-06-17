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

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedOption(event.target.value as string);
  };
  const options = data?.features.distinctCharacteristics.map(
    (characteristic: string) => ({
      value: characteristic,
      label: characteristic,
    })
  );

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
        <LineChart data={dataChart}>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
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
