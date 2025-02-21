import React from "react";
import { Tooltip } from "@mui/material";
import { Clock } from "lucide-react";

interface SyncIndicatorProps {
  lastSync: Date;
}

const SyncIndicator: React.FC<SyncIndicatorProps> = ({ lastSync }) => {
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <Tooltip title={`Last synced: ${lastSync.toLocaleString()}`} arrow>
      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
        <Clock className="h-4 w-4" />
        <span>Synced {formatTimeAgo(lastSync)}</span>
      </div>
    </Tooltip>
  );
};

export default SyncIndicator;
