"use client";
import React from "react";
import Link from "next/link";
import FormButton from "@/components/form/form-button";
import FormInput from "@/components/form/form-input";
import NextAuthButtons from "@/components/form/next-auth-buttons";
import { CommandIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  // Form errors
  const [emailError, setEmailError] = React.useState<string>("");
  const [passwordError, setPasswordError] = React.useState<string>("");

  // Loading state
  const [submitLoading, setSubmitLoading] = React.useState<boolean>(false);

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
    } catch (error: any) {
      console.error(error);
    } finally {
      setSubmitLoading(false);
    }
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
        />

        {/* Password */}
        <FormInput
          placeholder={"Password"}
          type={"password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Submit */}
        <FormButton
          label={"Sign up with Email"}
          type="submit"
          loading={submitLoading}
        />
      </form>
    </>
  );
};

export default RegisterPage;
