import {getAuthSession} from "@/lib/auth";
import {db} from "@/lib/db";
import {infinite_scroling_pagination_results} from "../../config";
import PostFeed from "./post-feed";

async function CustomFeed() {
  const session = await getAuthSession();
  const follodCommunities = db.subscription.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      subreddit: true,
    },
  });

  const posts = await db.post.findMany({
    where: {
      subreddit: {
        name: {
          in: (await follodCommunities).map(({subreddit}) => subreddit.id),
        },
      },
    },
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

export default CustomFeed;
