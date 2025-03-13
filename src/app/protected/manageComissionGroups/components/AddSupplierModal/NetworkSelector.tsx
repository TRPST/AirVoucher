import React from "react";

interface NetworkSelectorProps {
  selectedNetwork: string;
  setSelectedNetwork: (network: string) => void;
}

const NetworkSelector: React.FC<NetworkSelectorProps> = ({
  selectedNetwork,
  setSelectedNetwork,
}) => {
  // Network options constant
  const networkOptions = ["CELLC", "MTN", "VODACOM", "TELKOM"];

  // Network styles
  type NetworkProvider = "CELLC" | "MTN" | "VODACOM" | "TELKOM";

  const networkStyles: Record<
    NetworkProvider,
    {
      selected: string;
      default: string;
    }
  > = {
    CELLC: {
      selected: "border-gray-300 bg-white text-black",
      default:
        "border-gray-300 bg-transparent dark:text-white hover:bg-gray-50 dark:hover:text-black",
    },
    MTN: {
      selected: "border-yellow-400 bg-yellow-400 text-black",
      default:
        "border-yellow-400 bg-transparent dark:text-white hover:bg-yellow-400 dark:hover:text-black",
    },
    VODACOM: {
      selected: "border-red-600 bg-red-600 text-white",
      default:
        "border-red-600 bg-transparent dark:text-white hover:bg-red-600 hover:text-white",
    },
    TELKOM: {
      selected: "border-blue-600 bg-blue-600 text-white",
      default:
        "border-blue-600 bg-transparent dark:text-white hover:bg-blue-600 hover:text-white",
    },
  };

  return (
    <div className="mb-6 mt-6">
      <h3 className="mb-2 font-semibold text-gray-800 dark:text-gray-100">
        Filter by Network
      </h3>
      <div className="grid grid-cols-4 gap-4">
        {networkOptions.map((network) => (
          <button
            key={network}
            onClick={() => setSelectedNetwork(network as NetworkProvider)}
            className={`
              rounded-lg border p-4 text-center text-xs font-semibold shadow transition-colors duration-200
              ${
                selectedNetwork === network
                  ? networkStyles[network as NetworkProvider].selected
                  : networkStyles[network as NetworkProvider].default
              }
            `}
          >
            {network}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NetworkSelector;
