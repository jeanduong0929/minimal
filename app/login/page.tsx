"use client";
import React from "react";
import Link from "next/link";
import FormInput from "@/components/form/form-input";
import FormButton from "@/components/form/form-button";
import NextAuthButtons from "@/components/form/next-auth-buttons";
import { ChevronLeft, CommandIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const LoginPage = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen gap-5 w-[350px] mx-auto">
        {/* Redirect to login page */}
        <Link href={"/"} className="absolute top-5 left-10">
          <Button variant={"ghost"} type={"button"}>
            <ChevronLeft size={20} />
            Back
          </Button>
        </Link>

        {/* Header */}
        <div className="flex flex-col items-center gap-2">
          <CommandIcon size="30" />
          <h1 className="font-bold text-3xl">Welcome back</h1>
        </div>

        {/* Login Form */}
        <LoginForm />

        {/* NextAuth Buttons */}
        <NextAuthButtons />

        <footer>
          <Link href={"/register"} className="underline underline-offset-4">
            Need an account? Sign up
          </Link>
        </footer>
      </div>
    </>
  );
};

const LoginForm = () => {
  // Form states
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  // Form errors
  const [emailError, setEmailError] = React.useState<string>("");
  const [passwordError, setPasswordError] = React.useState<string>("");

  // Loading state
  const [submitLoading, setSubmitLoading] = React.useState<boolean>(false);

  // Custom hooks
  const router = useRouter();

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const data = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      console.log("Data: ", data);
      if (data && data.status === 401) {
        setEmailError("Invalid email or password");
      }

      router.push("/dashboard");
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
          error={emailError}
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
          label={"Sign In with Email"}
          type="submit"
          loading={submitLoading}
        />
      </form>
    </>
  );
};

export default LoginPage;
