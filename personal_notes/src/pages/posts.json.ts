import type { APIRoute } from "astro"

export const GET: APIRoute = async ({ params, request }) => {
    const allPosts = Object.values(import.meta.glob('./posts/*.md', { eager: true}))
    return new Response(
        JSON.stringify(allPosts)
    )

}
