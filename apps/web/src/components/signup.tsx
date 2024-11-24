"use client";
import Link from "next/link";
import { Input, Card } from "@kraft/ui";
import { useState } from "react";
import type { RegisterDTO } from "@kraft/types";

export function SignIn(): JSX.Element {
  const [user, setUser] = useState<RegisterDTO>({
    name: "",
    username: "",
    email: "",
    password: "",
    organizationDomain: undefined,
    organizationName: undefined,
  });
  return (
    <Card className="md:w-96">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 mt-5 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your details below to create your account
          </p>
        </div>
        <div className="space-y-2">
          <div>
            <Input
              placeholder="Name"
              type="text"
              required
              value={user.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUser((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <div>
            <Input
              placeholder="Username"
              type="text"
              required
              value={user.username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUser((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <Input
              placeholder="Email"
              type="email"
              required
              value={user.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUser((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <Input
              placeholder="Organization Name"
              type="text"
              value={user.organizationName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUser((prev) => ({
                  ...prev,
                  organizationName: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <Input
              placeholder="Organization Domain"
              type="text"
              value={user.organizationDomain}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUser((prev) => ({
                  ...prev,
                  organizationDomain: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <Input
              placeholder="Password"
              type="password"
              required
              value={user.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUser((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
            />
          </div>
        </div>
        <p className="px-8 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </Card>
  );
}
