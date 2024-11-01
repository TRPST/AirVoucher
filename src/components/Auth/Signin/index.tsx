import Link from "next/link";
import React from "react";
import GoogleSigninButton from "../GoogleSigninButton";
//import SigninWithPassword from "../SigninWithPassword";
import { Message } from "@/components/form-message";
import dynamic from "next/dynamic";

const SigninWithPassword = dynamic(
  () => import("@/components/Auth/SigninWithPassword"),
  {
    ssr: false,
  },
);

export default function Signin() {
  return (
    <>
      <GoogleSigninButton text="Sign in" />

      <div className="my-6 flex items-center justify-center">
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
        <div className="block w-full min-w-fit bg-white px-3 text-center font-medium dark:bg-gray-dark">
          Or sign in with email
        </div>
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
      </div>

      <div>
        <SigninWithPassword searchParams={Promise.resolve({} as Message)} />
      </div>

      <div className="mt-6 text-center">
        <p>
          Don’t have any account?{" "}
          <Link href="#" className="text-primary">
            Sign Up
          </Link>
        </p>
      </div>
    </>
  );
}
