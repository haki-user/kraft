"use client";
import { useState } from "react";
import { Signup, Login } from "@/components";

export default function Auth(): JSX.Element {
  const [isLoginPage, setIsLoginPage] = useState(true);
  return (
    <div className="flex justify-center items-center md:pt-8">
      {isLoginPage ? (
        <div>
          <Login />
          <div className="text-center text-sm mt-2">
            <button onClick={() => setIsLoginPage(false)} className="underline">
              Create a new account.
            </button>
          </div>
        </div>
      ) : (
        <div>
          <Signup />
          <div className="text-center text-sm mt-2">
            <button onClick={() => setIsLoginPage(true)} className="underline">
              Already have an account.
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
