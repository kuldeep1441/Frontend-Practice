import React, { useEffect, useState, RefObject, ChangeEvent, KeyboardEvent, ClipboardEvent } from "react";
import * as Yup from "yup";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { CustomTextField } from "@/components/Common";
import { POST } from "@/utilities/WebService";
import { useDispatch } from "react-redux";
import { ILoginResponse } from "@/interfaces/ILoginResponse";
import { LOGIN_API, OTP_API } from "@/utilities/ApiUrls";
import { userLoginValues } from "@/store/slices/loginSlice";
import { toast } from 'react-toastify';


interface FormValues {
  email: string;
  otp?: string;
}

interface OtpInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onPaste: (e: React.ClipboardEvent<HTMLInputElement>, currentIndex: number) => void;
  inputRef: React.RefObject<HTMLInputElement | any>;
}

const OtpInput: React.FC<OtpInputProps> = ({ value, onChange, onKeyDown, onPaste, inputRef }) => (
  <input
    type="text"
    inputMode="numeric"
    pattern="[0-9]*"
    maxLength={1}
    value={value}
    onChange={onChange}
    onKeyDown={onKeyDown}
    onPaste={(e) => onPaste(e, Number(inputRef.current?.dataset.index))}
    ref={inputRef}
    data-index={inputRef.current?.dataset.index} // Add data-index for tracking
    className="w-[2em] h-[2em] sm:w-[1.5em] md:w-[1.4em] text-center text-[2em] sm:text-[1.5em] md:text-[1.5em] text-[#808080] border rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
  />
);

export default function LoginPage() {
  const { push } = useRouter();
  const [isOtp, setIsOtp] = useState(false);
  const [timer, setTimer] = useState(0);
  const [disableResendOTPButton, setDisableResendOTPButton] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const otpRefs: RefObject<HTMLInputElement | null>[] = Array(6)
    .fill(0)
    .map(() => React.createRef<HTMLInputElement>());

  const loginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    otp: Yup.string()
      .test(
        "otp-required",
        "OTP is required",
        (value) => {
          if (!isOtp) return true;
          return Boolean(value?.trim());
        }
      )
  });

  const methods = useForm<FormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "", otp: "" }
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue
  } = methods;

  const handleOtpPaste = (event: ClipboardEvent<HTMLInputElement>, currentIndex: number): void => {
    event.preventDefault();
    
    // Retrieve the pasted OTP (allow only numeric characters)
    const pastedData = event.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    
    if (pastedData) {
      const newOtpValues = [...otpValues];
      
      // Distribute the pasted data across the OTP fields
      for (let i = 0; i < pastedData.length; i++) {
        newOtpValues[i] = pastedData[i];
      }
  
      setOtpValues(newOtpValues); // Update the OTP values state
      setValue('otp', newOtpValues.join(''), { shouldValidate: true }); // Update the form value
      
      // Focus on the next empty input or the last input if all are filled
      const nextEmptyIndex = newOtpValues.findIndex((value) => !value);
      if (nextEmptyIndex !== -1) {
        otpRefs[nextEmptyIndex].current?.focus();
      } else {
        otpRefs[5]?.current?.focus();
      }
    }
  };
  const handleOtpChange = (index: number, event: ChangeEvent<HTMLInputElement>): void => {
    const newValue = event.target.value.replace(/[^0-9]/g, ""); // Allow only numeric input
    if (newValue.length <= 1) {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = newValue;
      setOtpValues(newOtpValues);
      setValue("otp", newOtpValues.join(""), { shouldValidate: true });
  
      if (newValue.length === 1 && index < 5) {
        otpRefs[index + 1].current?.focus();
      }
    }
  
    // Always set the cursor to the right
    setTimeout(() => {
      event.target.setSelectionRange(event.target.value.length, event.target.value.length);
    });
  };
  
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>): void => {
    // Ensure the cursor is always at the end when the input is focused
    const length = event.target.value.length;
    event.target.setSelectionRange(length, length);
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>): void => {
    const { key } = event;
  
    if (key === "ArrowLeft") {
      // Prevent moving cursor to the left
      event.preventDefault();
      if (index > 0) {
        otpRefs[index - 1].current?.focus(); // Focus the previous input field
      }
    } else if (key === "ArrowRight") {
      // Move focus to the next field
      event.preventDefault();
      if (index < 5) {
        otpRefs[index + 1].current?.focus();
      }
    } else if (key === "Backspace") {
      // Handle backspace behavior
      if (!otpValues[index] && index > 0) {
        otpRefs[index - 1].current?.focus();
      }
    }
  };

  const onSubmit = async (data: FormValues): Promise<void> => {
    setDisableButton(true);
    localStorage.setItem("accessToken", "practice");
    push("/dashboard");
    

    // if (isOtp) {
    //   // OTP verification logic
    //   const fullOtp = otpValues.join('');
    //   if (fullOtp.length === 6) {
    //     try {
    //       const payload = { email: data.email, otp: fullOtp };
    //       const response = await POST<ILoginResponse, any>(`${LOGIN_API}`, payload);

    //       if (response?.status === 201 && response?.data) {
    //         // Save access token in localStorage
    //         // localStorage.setItem("accessToken", response.data.accessToken);
    //         localStorage.setItem("accessToken", "practice");
    //         localStorage.setItem("email", response.data.email);

    //         // Dispatch user details to Redux store
    //         dispatch(
    //           userLoginValues({
    //             _id: response.data._id,
    //             email: response.data.email,
    //             name: response.data.name,
    //             phone: response.data.phone,
    //             location: response.data.location,
    //             website: response.data.website,
    //             utm_source: response.data.utm_source,
    //             isActive: response.data.isActive,
    //             createdBy: response.data.createdBy,
    //             createdAt: response.data.createdAt,
    //             updatedAt: response.data.updatedAt,
    //             loginOTP: response.data.loginOTP,
    //             loginOTPSentAt: response.data.loginOTPSentAt,
    //             message: response.data.message,
    //           })
    //         );

    //         push("/dashboard");
    //         setDisableButton(false);
    //         return;
    //       }
    //     } catch (error: any) {
    //       if (error.response) {
    //         const statusCode = error.response.status;
    //         const message = error.response.data?.message || "An error occurred";

    //         if (statusCode === 400 || statusCode === 406) {
    //           setDisableButton(false);
    //           toast.error(message);
    //         } else {
    //           toast.error(`Error: ${message}`);
    //           setDisableButton(false);
    //         }
    //       } else {
    //         setDisableButton(false);
    //         console.error("Unexpected error:", error);
    //         toast.error("An unexpected error occurred.");
    //         return;
    //       }
    //     }
    //   } else {
    //     toast.error("Please enter a valid 6-digit OTP.");
    //     setDisableButton(false);
    //   }
    // } else {
    //   // Send OTP logic
    //   const payload = { email: data.email };
    //   setDisableButton(true);
    //   try {
    //     const response = await POST<ILoginResponse, any>(`${OTP_API}`, payload);
    //     if (response.status === 201) {
    //       setIsOtp(true);
    //       setTimer(60);
    //       setDisableResendOTPButton(true);
    //       toast.success("OTP sent successfully!");
    //       setDisableButton(false);
    //       return;
    //     }
    //   } catch (error: any) {
    //     setDisableButton(false);
    //     if (error?.response?.data?.message) {
    //       const errorMessage = Array.isArray(error.response.data.message)
    //         ? error.response.data.message
    //         : error.response.data.message;
            
    //       if(error.response.data.statusCode === 400){
    //         toast.error(error.response.data.message[0]);
    //         return;
    //       }
    //       toast.error(errorMessage);
    //       return;
    //     }
    //     toast.error("Failed to send OTP. Please try again.");
    //   }
    // }
  };

  const handleResendOtp = async () => {
    try {
      const email = getValues("email");

      if (!email) {
        toast.error("Email is required");
        return;
      }

      setDisableResendOTPButton(true);
      setTimer(120);

      const payload = { email };
      const response = await POST<ILoginResponse, any>(`${OTP_API}`, payload);

      if (!response) {
        toast.error("No response from server");
        setDisableResendOTPButton(false);
        setTimer(0);
        return;
      }

      if (response.status === 201) {
        toast.success("OTP resent successfully!");
        return;
      }

      toast.error("Failed to resend OTP");
      setDisableResendOTPButton(false);
      setTimer(0);
    } catch (error: any) {
      setDisableResendOTPButton(false);
      setTimer(0);

      const errorMessage = error.message || "Failed to resend OTP. Please try again.";
      console.error("Error resending OTP:", error);
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            setDisableResendOTPButton(false);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  return (
    <div key={isOtp ? "otp" : "email"} className="">
      {!isOtp ? (
        <div>
          <p className="text-[1.75em] font-[600]">Login</p>
        </div>
      ) : (
        <div className="flex flex-col gap-[1em]">
          <p className="text-[1.75em] font-[600]">Enter OTP</p>
          <div className="flex">
            <p className="text-[1em] font-[400]">
              Enter OTP sent to {getValues("email")} &nbsp;
              <button
                onClick={() => {
                  setIsOtp(false);
                  reset();
                }}
                className="text-[1em] font-[600] underline"
              >
                Edit
              </button>
            </p>
          </div>
        </div>
      )}

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col pt-[2em]">
          {!isOtp && (
            <CustomTextField
              name="email"
              control={control}
              label="Email"
              placeholder="Enter your email"
              error={errors.email?.message}
            />
          )}

          {isOtp && (
            <div className="space-y-4 pb-[.5em]">
              <div className="flex gap-[1em] justify-between">
                {otpValues.map((digit, index) => (
                  <OtpInput
                  key={index}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={(e) => handleOtpPaste(e, index)} // Pass index to handleOtpPaste
                  inputRef={otpRefs[index]}
                />
                ))}
              </div>
              {errors.otp && (
                <p className="text-red-500 text-sm">{errors.otp.message}</p>
              )}
            </div>
          )}

          {isOtp && (
            <div className="flex text-[1em] my-[1em]">
              <p className="font-[400]">Didn't Receive OTP?</p>
              <button
                type="button"
                className="font-[600] pl-[.313em]"
                onClick={handleResendOtp}
                disabled={disableResendOTPButton}
              >
                <span className="underline">Resend</span>{' '}
                <span className="no-underline">
                  {timer > 0 && `in ${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')}`}
                </span>
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={disableButton}
            className={`mt-[1em] bg-[#14126D] rounded-lg p-3 text-[#fff] cursor-pointer ${disableButton && 'opacity-10'}`}
          >
            {!isOtp ? "Get OTP" : disableButton ? "Verifying" : "Verify"}
          </button>
        </form>
      </FormProvider>
    </div>
  );
}