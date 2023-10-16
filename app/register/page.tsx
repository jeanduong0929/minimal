"use client";
import React from "react";
import Link from "next/link";
import FormButton from "@/components/form/form-button";
import FormInput from "@/components/form/form-input";
import NextAuthButtons from "@/components/form/next-auth-buttons";
import { CommandIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import instance from "@/lib/axios-config";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  return (
    <>
      <div className="flex w-full h-full">
        <div className="w-1/2 h-screen bg-slate-900" />
        <div className="flex flex-col items-center justify-center h-screen gap-5 w-[350px] mx-auto">
          {/* Redirect to login page */}
          <Link href={"/login"} className="absolute top-5 right-10">
            <Button variant={"ghost"} type={"button"}>
              Login
            </Button>
          </Link>

          {/* Header */}
          <div className="flex flex-col items-center gap-2">
            <CommandIcon size="30" />
            <h1 className="font-bold text-3xl">Create an account</h1>
          </div>

          {/* Login Form */}
          <RegisterForm />

          {/* NextAuth Buttons */}
          <NextAuthButtons />

          <footer>
            <Link href={"/login"} className="underline underline-offset-4">
              Already have an account?
            </Link>
          </footer>
        </div>
      </div>
    </>
  );
};

const RegisterForm = () => {
  // Form states
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [disableSubmit, setDisableSubmit] = React.useState<boolean>(true);

  // Form errors
  const [emailError, setEmailError] = React.useState<string>("");
  const [passwordError, setPasswordError] = React.useState<string>("");

  // Loading state
  const [submitLoading, setSubmitLoading] = React.useState<boolean>(false);

  // Custom hooks
  const { toast } = useToast();
  const router = useRouter();

  React.useEffect(() => {
    if (email && password && !emailError && !passwordError) {
      setDisableSubmit(false);
    } else {
      setDisableSubmit(true);
    }
  }, [email, password, emailError, passwordError]);

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);

    if (!e.target.value.trim()) {
      setEmailError("Email is required");
    } else if (!isValidEmail(e.target.value)) {
      setEmailError("Email is invalid");
    } else {
      setEmailError("");
    }
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);

    if (!e.target.value.trim()) {
      setPasswordError("Password is required");
    } else if (!isValidPassword(e.target.value)) {
      setPasswordError(
        "Password must be at least 8 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number and 1 special character",
      );
    } else {
      setPasswordError("");
    }
  };

  const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      await instance.post("/auth/register", {
        email,
        password,
      });

      toast({
        description: "Account created successfully",
        className: "bg-green-500 text-white",
      });

      router.push("/login");
    } catch (error: any) {
      console.error(error);
      if (error.response && error.response.status === 409) {
        setEmailError("Email already exists");
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const isValidEmail = (email: string) => {
    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);
  };

  const isValidPassword = (password: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/.test(
      password,
    );
  };

  return (
    <>
      <form
        className="flex flex-col items-center justify-center gap-3 w-full"
        onSubmit={handleForm}
      >
        {/* Email */}
        <FormInput
          placeholder={"name@example.com"}
          type={"email"}
          value={email}
          onChange={handleEmail}
          onBlur={handleEmail}
          error={emailError}
        />

        {/* Password */}
        <FormInput
          placeholder={"Password"}
          type={"password"}
          value={password}
          onChange={handlePassword}
          onBlur={handlePassword}
          error={passwordError}
        />

        {/* Submit */}
        <FormButton
          label={"Sign up with Email"}
          type="submit"
          loading={submitLoading}
          disabled={disableSubmit}
        />
      </form>
    </>
  );
};

export default RegisterPage;
