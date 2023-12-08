"use client";

import UseCustomToast from "@/hooks/use-custom-toast";
import {cn} from "@/lib/utils";
import {CommentVoteRequest} from "@/lib/validators/vote";
import {usePrevious} from "@mantine/hooks";
import {CommentVote, VoteType} from "@prisma/client";
import {useMutation} from "@tanstack/react-query";
import axios, {AxiosError} from "axios";
import {ArrowBigDown, ArrowBigUp} from "lucide-react";
import {useState} from "react";
import {Button} from "./ui/Button";
import {toast} from "./ui/use-toast";
type Props = {
  commentId: string;
  initialVotesAmt: number;
  initialVote?: Pick<CommentVote, "type">;
};

function CommentVote({commentId, initialVotesAmt, initialVote}: Props) {
  const {loginToast} = UseCustomToast();

  const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt);
  const [currentVote, setCurrentVote] = useState(initialVote);
  const prevVote = usePrevious(currentVote);

  const {mutate: vote} = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: CommentVoteRequest = {
        commentId,
        voteType,
      };

      await axios.patch(`/api/subreddit/post/comment/vote`, payload);
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
      if (currentVote?.type === type) {
        setCurrentVote(undefined);
        if (type === "UP") setVotesAmt((prev) => prev - 1);
        else if (type === "DOWN") setVotesAmt((prev) => prev + 1);
      } else {
        setCurrentVote({type});
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
    <div className="flex gap-1">
      <Button
        size="sm"
        variant="ghost"
        aria-label="upvote"
        onClick={() => vote("UP")}
      >
        <ArrowBigUp
          className={cn(
            "h-5 w-5 text-zinc-700",
            currentVote?.type === "UP" && `text-emerald-500 fill-emerald-500`
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
            currentVote?.type === "DOWN" && `text-red-500 fill-red-500`
          )}
        />
      </Button>
    </div>
  );
}

export default CommentVote;
