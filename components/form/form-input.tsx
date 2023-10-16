import React from "react";
import { Input } from "../ui/input";

interface FormInputProps {
  placeholder: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  placeholder,
  type,
  value,
  onChange,
  onBlur,
  error,
}) => {
  return (
    <>
      <div className="flex flex-col items-start gap-2 w-full">
        <Input
          placeholder={placeholder}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
        {error && <p className="pl-2 text-red-500 text-sm">{error}</p>}
      </div>
    </>
  );
};

export default FormInput;
