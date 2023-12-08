"use client";
import {useMutation} from "@tanstack/react-query";
import {Button} from "./ui/Button";
import {SubscribeToSubRedditPayload} from "@/lib/validators/sub-reddit";
import axios, {AxiosError} from "axios";
import UseCustomToast from "@/hooks/use-custom-toast";
import {toast} from "./ui/use-toast";
import {startTransition} from "react";
import {useRouter} from "next/navigation";

type Props = {
  subredditId: string;
  subredditName: string;
  isSubscribed: boolean;
};

function SubscribeLeaveToggle({
  subredditId,
  subredditName,
  isSubscribed,
}: Props) {
  const {loginToast} = UseCustomToast();
  const router = useRouter();

  const {mutate: subscribe, isLoading: isSubLoading} = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubRedditPayload = {
        subredditId,
      };

      const {data} = await axios.post(`/api/subreddit/subscribe`, payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }
      return toast({
        title: "There was an error",
        description: "Could not subscribe to subreddit.Please try again",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      return toast({
        title: "Subscribed",
        description: `You are now subscribed to r/${subredditName}`,
      });
    },
  });
  const {mutate: unsubscribe, isLoading: isUnSubLoading} = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubRedditPayload = {
        subredditId,
      };

      const {data} = await axios.post(`/api/subreddit/unsubscribe`, payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }
      return toast({
        title: "There was an error",
        description: "Could not subscribe to subreddit.Please try again",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });

      return toast({
        title: "Unsubscribed",
        description: `You are now unsubscribed to r/${subredditName}`,
      });
    },
  });

  return isSubscribed ? (
    <Button
      className="w-full mt-1 mb-4"
      onClick={() => unsubscribe()}
      isLoading={isUnSubLoading}
    >
      Leave Community
    </Button>
  ) : (
    <Button
      className="w-full mt-1 mb-4"
      isLoading={isSubLoading}
      onClick={() => subscribe()}
    >
      Join to post
    </Button>
  );
}

export default SubscribeLeaveToggle;
