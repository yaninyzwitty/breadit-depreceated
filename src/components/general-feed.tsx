import {db} from "@/lib/db";
import React from "react";
import {infinite_scroling_pagination_results} from "../../config";
import PostFeed from "./post-feed";

async function GeneralFeed() {
  const posts = await db.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      subreddit: true,
    },
    take: infinite_scroling_pagination_results,
  });
  return <PostFeed initialPosts={posts} />;
}

export default GeneralFeed;
