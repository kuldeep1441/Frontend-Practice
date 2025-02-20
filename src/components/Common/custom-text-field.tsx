import React from "react";
import { Controller, Control } from "react-hook-form";

type CustomTextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  control: Control<any>;
  label?: string;
  error?: string;
  postfixIcon?: React.ReactNode;
};

const CustomTextField: React.FC<CustomTextFieldProps> = ({
  name,
  control,
  label,
  type = "text",
  placeholder,
  error,
  postfixIcon,
  ...otherInputProps
}) => {
  return (
    <div style={{ marginBottom: "16px" }}>
      {label && (
        <label
          className="text-[1em] font-[500]"
          style={{ display: "block", marginBottom: "6px" }}
        >
          {label}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div style={{ position: "relative" }}>
            <input
              {...field}
              type={type}
              placeholder={placeholder}
              style={{
                outlineColor: "#D1E9FF",
                width: "100%",
                padding: "15px 35px 15px 12px",
                border: error ? "1px solid #ED0000" : "1px solid #D0D5DD",
                borderRadius: "8px",
              }}
              autoComplete="off"
              {...otherInputProps}
            />
            {postfixIcon && (
              <div
                style={{
                  position: "absolute",
                  right: "20px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                {postfixIcon}
              </div>
            )}
          </div>
        )}
      />
      {error && (
        <p style={{ color: "#ED0000", fontSize: "12px", marginTop: "4px" }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default CustomTextField;
