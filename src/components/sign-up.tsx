import React from "react";
import {Icons} from "./icons";
import Link from "next/link";
import UserAuthForm from "./user-auth-form";
function SignUp() {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px] ">
      <div className="flex flex-col space-y-2 text-center">
        <Icons.logo className="mx-auto h-6 w-6" />
        <h1 className="text-2xl font-semibold tracking-tight">Sign up</h1>
        <p className="text-sm max-w-xs mx-auto">
          By continuing you are setting up a Breadit account and agreeing to our
          Privacy Policy
        </p>
        {/* Sign up form */}
        <UserAuthForm />
        <p className="px-8 text-center text-sm text-zinc-700">
          Already a Breadittor?{" "}
          <Link
            href="/sign-in"
            prefetch={false}
            className="hover:text-zinc-800 text-sm underline underline-offset-4"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
