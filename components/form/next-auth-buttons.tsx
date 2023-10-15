import React from "react";
import GithubIcon from "../svgs/github-icon";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";

const NextAuthButtons = () => {
  // Loading state
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleSignIn = async () => {
    setLoading(true);
    await signIn("github", { callbackUrl: "/dashboard" });
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full gap-3">
        <div className="flex items-center gap-5 w-full">
          <hr className="w-full" />
          <p>OR</p>
          <hr className="w-full" />
        </div>
        <Button className="w-full" onClick={handleSignIn} disabled={loading}>
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <GithubIcon className="w-5 h-5 mr-2" />
          )}
          Github
        </Button>
      </div>
    </>
  );
};

export default NextAuthButtons;
