import axios from "axios";

export async function GET (req: Request) {
    const url = new URL(req.url);
    const href = url.searchParams.get('href');
    if(!href) return new Response('Invalid Href', {status: 400});
    const response = await axios.get(href);
      // Parse the HTML using regular expressions
  const titleMatch = response.data.match(/<title>(.*?)<\/title>/)
  const title = titleMatch ? titleMatch[1] : ''

  const descriptionMatch = response.data.match(
    /<meta name="description" content="(.*?)"/
  )
  const description = descriptionMatch ? descriptionMatch[1] : ''

  const imageMatch = response.data.match(/<meta property="og:image" content="(.*?)"/)
  const imageUrl = imageMatch ? imageMatch[1] : ''

    // Return the data in the format required by the editor tool

    return new Response(JSON.stringify({
        success: 1,
        meta: {
            title, description, image: {
                url: imageUrl,
            }
        }
    }))

   
    
}