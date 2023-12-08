import {getAuthSession} from "@/lib/auth";
import {db} from "@/lib/db";
import {infinite_scroling_pagination_results} from "../../../../config";
import {notFound} from "next/navigation";
import MiniCreatePost from "@/components/mini-create-post";
import PostFeed from "@/components/post-feed";

type Props = {params: {slug: string}};
async function SlugPage({params: {slug}}: Props) {
  const session = await getAuthSession();
  const subreddit = await db.subreddit.findFirst({
    where: {name: slug},
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subreddit: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: infinite_scroling_pagination_results,
      },
    },
  });

  if (!subreddit) return notFound();

  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl h-14">
        r/{subreddit.name}
      </h1>
      <MiniCreatePost session={session} />
      {/* todo show posts in user feed */}
      <PostFeed initialPosts={subreddit.posts} subredditName={subreddit.name} />
    </>
  );
}

export default SlugPage;
