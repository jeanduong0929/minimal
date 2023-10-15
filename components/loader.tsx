import { Loader2 } from "lucide-react";
import React from "react";

const Loader = () => {
  return (
    <>
      <div className="fixed flex items-center justify-center inset-0 z-30 backdrop-blur-md fade-in">
        <Loader2 className="h-20 w-20 animate-spin" />
      </div>
    </>
  );
};

export default Loader;
