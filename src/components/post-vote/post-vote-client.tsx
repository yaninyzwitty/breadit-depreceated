"use client";

import UseCustomToast from "@/hooks/use-custom-toast";
import {usePrevious} from "@mantine/hooks";
import {Vote, VoteType} from "@prisma/client";
import {useEffect, useState} from "react";
import {Button} from "../ui/Button";
import {ArrowBigDown, ArrowBigUp, ArrowDown} from "lucide-react";
import {cn} from "@/lib/utils";
import {useMutation} from "@tanstack/react-query";
import {PostVoteRequest} from "@/lib/validators/vote";
import axios, {AxiosError} from "axios";
import {toast} from "../ui/use-toast";

type Props = {
  postId: string;
  initialVotesAmt: number;
  initialVote?: VoteType | null;
};

function PostVoteClient({postId, initialVotesAmt, initialVote}: Props) {
  const {loginToast} = UseCustomToast();

  const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt);
  const [currentVote, setCurrentVote] = useState(initialVote);
  const prevVote = usePrevious(currentVote);

  useEffect(() => {
    setCurrentVote(initialVote);
  }, [initialVote]);

  const {mutate: vote} = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: PostVoteRequest = {
        postId,
        voteType,
      };

      await axios.patch(`/api/subreddit/post/vote`, payload);
    },
    onError: (err, voteType) => {
      if (voteType === "UP") {
        setVotesAmt((prev) => prev - 1);
      } else {
        setVotesAmt((prev) => prev + 1);
        // reset current vote
        setCurrentVote(prevVote);
        if (err instanceof AxiosError) {
          if (err.response?.status === 401) {
            return loginToast();
          }
        }

        return toast({
          title: "Something went wrong",
          description: "Could not vote at this time. Please try again later.",
          variant: "destructive",
        });
      }
    },
    onMutate: (type: VoteType) => {
      if (currentVote === type) {
        setCurrentVote(undefined);
        if (type === "UP") setVotesAmt((prev) => prev - 1);
        else if (type === "DOWN") setVotesAmt((prev) => prev + 1);
      } else {
        setCurrentVote(type);
        if (type === "UP") setVotesAmt((prev) => prev + (currentVote ? 2 : 1));
        else if (type === "DOWN")
          setVotesAmt((prev) => prev - (currentVote ? 2 : 1));
        //   else setVotesAmt(initialVotesAmt);

        //   return () => {
        //     setCurrentVote(undefined);
        //     setVotesAmt(initialVotesAmt);
      }
    },
  });

  return (
    <div className="flex sm:flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0">
      <Button
        size="sm"
        variant="ghost"
        aria-label="upvote"
        onClick={() => vote("UP")}
      >
        <ArrowBigUp
          className={cn(
            "h-5 w-5 text-zinc-700",
            currentVote === "UP" && `text-emerald-500 fill-emerald-500`
          )}
        />
      </Button>
      <p className="text-center py-2 font-medium text-zinc-900">{votesAmt}</p>
      <Button
        size="sm"
        variant="ghost"
        aria-label="downvote"
        onClick={() => vote("DOWN")}
      >
        <ArrowBigDown
          className={cn(
            "h-5 w-5 text-zinc-700",
            currentVote === "DOWN" && `text-red-500 fill-red-500`
          )}
        />
      </Button>
    </div>
  );
}

export default PostVoteClient;
