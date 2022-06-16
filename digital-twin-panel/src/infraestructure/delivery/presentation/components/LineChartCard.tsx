import { useEffect, useState } from "react";

type Props = {
    data?: AreasPerUser;
}

export const LineChartCard = ({ data }: Props) => {
    const [selectedOption, setSelectedOption] = useState<string>();

    useEffect(() => {
        setSelectedOption(data?.features.distinctCharacteristics[0]);
    }
    , [data]);

    