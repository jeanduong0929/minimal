import React from "react";

interface EllipsisVerticalIconProps {
  className?: string;
}

const EllipsisVerticalIcon: React.FC<EllipsisVerticalIconProps> = ({
  className,
}) => {
  return (
    <svg
      viewBox="0 0 128 512"
      fill="currentColor"
      height="1em"
      width="1em"
      className={className}
    >
      <path d="M64 360c30.9 0 56 25.1 56 56s-25.1 56-56 56-56-25.1-56-56 25.1-56 56-56zm0-160c30.9 0 56 25.1 56 56s-25.1 56-56 56-56-25.1-56-56 25.1-56 56-56zm56-104c0 30.9-25.1 56-56 56S8 126.9 8 96s25.1-56 56-56 56 25.1 56 56z" />
    </svg>
  );
};

export default EllipsisVerticalIcon;
