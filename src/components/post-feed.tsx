"use client";
import {useIntersection} from "@mantine/hooks";
import {ExtendedPost} from "@/types/db";
import React, {useEffect, useRef} from "react";
import {useInfiniteQuery} from "@tanstack/react-query";
import {infinite_scroling_pagination_results} from "../../config";
import axios from "axios";
import {Vote} from "lucide-react";
import {VoteType} from "@prisma/client";
import {useSession} from "next-auth/react";
import Post from "./post";

type Props = {
  initialPosts: ExtendedPost[];
  subredditName?: string;
};

function PostFeed({initialPosts, subredditName}: Props) {
  const {data: session} = useSession();

  const lastPostRef = useRef<HTMLElement>(null);
  const {ref, entry} = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  const {data, fetchNextPage, isFetchingNextPage} = useInfiniteQuery(
    ["infinite-query"],
    async ({pageParam = 1}) => {
      const query =
        `/api/posts?limit=${infinite_scroling_pagination_results}&page=${pageParam}` +
        (!!subredditName ? `&subredditName=${subredditName}` : "");

      const {data} = await axios.get(query);
      return data as ExtendedPost[];
    },

    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialData: {pages: [initialPosts], pageParams: [1]},
    }
  );

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage(); // Load more posts when the last post comes into view
    }
  }, [entry, fetchNextPage]);

  const posts = data?.pages.flatMap((page) => page) ?? initialPosts;

  return (
    <ul className="flex flex-col col-span-2 space-y-6">
      {posts.map((post, index) => {
        const votesAmt = post.votes.reduce((acc, current) => {
          if (VoteType.UP === "UP") return acc + 1;
          if (VoteType.DOWN === "DOWN") return acc - 1;
          return acc;
        }, 0);

        // det if user has already voted
        const currentVote = post.votes.find(
          (vote) => vote.userId === session?.user?.id
        );

        if (index === posts.length - 1) {
          return (
            <li key={post.id} ref={ref}>
              <Post
                post={post}
                subredditName={post.subreddit.name}
                commentAmt={post.comments.length}
                currentVote={currentVote}
                votesAmt={votesAmt}
              />
            </li>
          );
        }
        return (
          <Post
            key={post.id}
            post={post}
            subredditName={post.subreddit.name}
            commentAmt={post.comments.length}
            currentVote={currentVote}
            votesAmt={votesAmt}
          />
        );
      })}
    </ul>
  );
}

export default PostFeed;
