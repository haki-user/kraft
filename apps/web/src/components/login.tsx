"use client";
import Link from "next/link";
import { Button, Card, Input, Icons } from "@kraft/ui";
import { useState } from "react";
import type { LoginDTO } from "@kraft/types";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/auth-service";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";

export function Login(): JSX.Element {
  const [user, setUser] = useState<LoginDTO>({
    email: "",
    password: "",
  });
  const router = useRouter();
  const { toast } = useToast();
  const handleRegister = async () => {
    setIsLoading(true);
    try {
      await loginUser(user);
      toast({
        title: "Success",
        description: "Logged in successfully",
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
            Sign in to your account
          </h1>
          {/* <p className="text-sm text-muted-foreground"> */}
          {/* Enter your details below to create your account */}
          {/* </p> */}
        </div>
        <div className="space-y-2">
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
            Login
          </Button>
        </div>
        {/* <p className="px-8 text-center text-sm text-muted-foreground">
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
        </p> */}
      </div>
    </Card>
  );
}
