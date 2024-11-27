"use client";
import Link from "next/link";
import { Button, Card, Input, Icons } from "@kraft/ui";
import { useState } from "react";
import type { RegisterDTO } from "@kraft/types";
import { useRouter } from "next/navigation";
import { registerUser, loginUser } from "@/services/auth-service";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";

export function Signup(): JSX.Element {
  const [user, setUser] = useState<RegisterDTO>({
    name: "",
    username: "",
    email: "",
    password: "",
    organizationDomain: undefined,
    organizationName: undefined,
  });
  const router = useRouter();
  const { toast } = useToast();
  const handleRegister = async () => {
    setIsLoading(true);
    try {
      await registerUser(user);
      toast({
        title: "Success",
        description: "Account created successfully",
        variant: "success",
      });
      if (document.referrer && document.referrer !== window.location.href) {
        router.back();
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof AxiosError) {
        toast({
          title: "Error",
          description: err.response?.data.message || err.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  const [isLoading, setIsLoading] = useState<boolean>(false);
  return (
    <Card className="sm:w-96 transition-all max-sm:p-5 p-2">
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
        <div>
          <Button
            disabled={isLoading}
            onClick={handleRegister}
            className="w-full"
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In with Email
          </Button>
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
