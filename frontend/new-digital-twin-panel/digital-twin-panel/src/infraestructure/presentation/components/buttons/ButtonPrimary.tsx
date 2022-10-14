import { SpinnerCircular } from "spinners-react";

type ButtonPrimaryProps = {
  children: React.ReactNode;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
};

const ButtonPrimary = ({
  children,
  onClick,
  loading,
  disabled,
}: ButtonPrimaryProps) => {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={onClick}
      disabled={disabled}
    >
      {loading ? <SpinnerCircular /> : children}
    </button>
  );
};

export default ButtonPrimary;
