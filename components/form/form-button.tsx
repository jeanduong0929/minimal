import React from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

interface FormButtonProps {
  label: string;
  type: "button" | "submit" | "reset";
  loading?: boolean;
  disabled?: boolean;
}

const FormButton: React.FC<FormButtonProps> = ({
  label,
  type,
  loading,
  disabled,
}) => {
  return (
    <>
      <Button className="w-full" type={type} disabled={loading || disabled}>
        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {label}
      </Button>
    </>
  );
};

export default FormButton;
