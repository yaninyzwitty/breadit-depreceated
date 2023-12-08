"use client";
import React, {useState} from "react";
import {Button} from "./ui/Button";
import {cn} from "@/lib/utils";
import {signIn} from "next-auth/react";
import {Icons} from "./icons";
import {useToast} from "@/components/ui/use-toast";

type Props = {
  className?: string;
};

function UserAuthForm({className}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const {toast} = useToast();

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      await signIn("google");
    } catch (error) {
      // toast notification
      toast({
        title: "Something went wrong",
        variant: "destructive",
        description: "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className={cn(`flex justify-center`, className)}>
      <Button
        size={"sm"}
        className="w-full"
        onClick={loginWithGoogle}
        isLoading={isLoading}
      >
        {isLoading ? null : (
          <>
            <Icons.google className="h-4 w-4 mr-2" />
            Google
          </>
        )}
      </Button>
    </div>
  );
}

export default UserAuthForm;
