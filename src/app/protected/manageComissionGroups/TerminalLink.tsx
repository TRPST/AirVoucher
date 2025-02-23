import React from "react";
import Link from "next/link";

interface TerminalLinkProps {
  terminalId: string;
}

const TerminalLink: React.FC<TerminalLinkProps> = ({ terminalId }) => {
  return (
    <Link
      href={`/protected/manageTerminals/${terminalId}`}
      className="text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
    >
      {terminalId}
    </Link>
  );
};

export default TerminalLink;
