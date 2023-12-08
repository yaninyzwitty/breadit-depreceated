import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostValidator } from "@/lib/validators/post";
import { SubscriptionValidator } from "@/lib/validators/sub-reddit";
import { z } from "zod";

export async function POST(req: Request) {
    try {
      const session = await getAuthSession()
  
      if (!session?.user) {
        return new Response('Unauthorized', { status: 401 })
      }
  
      const body = await req.json()
      const { subredditId, title, content } = PostValidator.parse(body)
  
      // check if user has already subscribed to subreddit
      const subscriptionExists = await db.subscription.findFirst({
        where: {
          subredditId,
          userId: session.user.id,
        },
      })
  
      if (!subscriptionExists) {
        return new Response("Subscribe to post", {
          status: 400,
        })
      }
  
      // create subreddit and associate it with the user
      await db.post.create({
        data: {
          subredditId,
          title,
          content,
          authorId: session.user.id,

        },
      })
  
      return new Response('OK')
    } catch (error) {
      if (error instanceof z.ZodError) {
        return new Response(error.message, { status: 400 })
      }
  
      return new Response(
        'Could not post to subreddit at this time. Please try later',
        { status: 500 }
      )
    }
  }