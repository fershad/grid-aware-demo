export default async (request, context) => new Response(`Hello, world! From ${context.geo.country.code}`)



export const config = {
  path: "/power-breakdown",
  excludedPath: ["/static/*"],
}
