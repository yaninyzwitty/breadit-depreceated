"use client";
import {useRef, useState} from "react";
import UserAvatar from "./ui/user-avatar";
import {Comment, CommentVote as CommentVotePrisma, User} from "@prisma/client";
import {format} from "date-fns";
import {formatTimeToNow} from "@/lib/utils";
import CommentVote from "./comment-votes";
import {Button} from "./ui/Button";
import {MessageSquare} from "lucide-react";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import {Label} from "./ui/label";
import {Textarea} from "./ui/textarea";
import {useMutation} from "@tanstack/react-query";
import {CommentRequest} from "@/lib/validators/comment";
import axios from "axios";
import {toast} from "./ui/use-toast";

type ExtendedComment = Comment & {
  votes: CommentVotePrisma[];
  author: User;
};

type Props = {
  comment: ExtendedComment;
  votesAmt: number;
  currentVote: CommentVotePrisma | undefined;
  postId: string;
};

function PostComment({comment, votesAmt, currentVote, postId}: Props) {
  const [input, setInput] = useState("");
  const commentRef = useRef<HTMLDivElement>(null);
  const [isReplying, setIsReplying] = useState(false);
  const router = useRouter();
  const {data: session} = useSession();

  const {mutate: postComment, isLoading} = useMutation({
    mutationFn: async ({postId, text, replyToId}: CommentRequest) => {
      const payload: CommentRequest = {
        postId,
        text,
        replyToId,
      };
      const {data} = await axios.patch(`/api/subreddit/post/comment`, payload);
      return data;
    },
    onError: () => {
      return toast({
        title: "Something went wrong",
        description: "Comment was not posted successfully, please try again",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.refresh();
      setIsReplying(false);
      setInput("");
    },
  });
  return (
    <div className="flex flex-col" ref={commentRef}>
      <div className="flex items-center">
        <UserAvatar
          user={{
            name: comment.author.name || null,
            image: comment.author.image || null,
          }}
          className="h-6 w-6"
        />
        <div className="ml-2 flex items-center gap-x-2 ">
          <p className="text-sm font-medium text-gray-900">
            u/{comment.author.username}
          </p>
          <p className="max-h-40 truncate text-xs text-zinc-500">
            {formatTimeToNow(new Date(comment.createdAt))}
          </p>
        </div>
      </div>
      <p className="text-sm text-zinc-900 mt-2">{comment.text}</p>
      <div className="flex gap-2 items-center flex-wrap">
        <CommentVote
          commentId={comment.id}
          initialVotesAmt={votesAmt}
          initialVote={currentVote}
        />

        <Button
          variant={"ghost"}
          size={"xs"}
          aria-label="reply"
          onClick={() => {
            if (!session) {
              return router.push("sign-in");
            }

            setIsReplying(true);
          }}
        >
          <MessageSquare className="h-4 w-4 mr-1.5" />
          Reply
        </Button>
        {isReplying ? (
          <div className="grid w-full gap-1.5">
            <Label htmlFor="comment">Your comment</Label>
            <div className="mt-2 ">
              <Textarea
                id="comment"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={1}
                placeholder="What are your thoughts?"
              />
              <div className="mt-2 flex justify-end gap-2">
                <Button
                  onClick={() => setIsReplying(false)}
                  variant={"subtle"}
                  tabIndex={-1}
                >
                  Cancel
                </Button>
                <Button
                  isLoading={isLoading}
                  disabled={input.length === 0}
                  onClick={() => {
                    if (!input) return;
                    postComment({
                      postId,
                      text: input,
                      replyToId: comment.replyToId ?? comment.id,
                    });
                  }}
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default PostComment;
