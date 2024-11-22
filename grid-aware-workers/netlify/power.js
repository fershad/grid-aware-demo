import { HTMLRewriter } from "html-rewriter";

export default async (request, context) => {
  return new HTMLRewriter()
    .on("h1", {
      element(element) {
        const location = context.geo.country.name;
        element.setInnerContent(`Power Breakdown for ${location}`);
      }
    })
    .transform(await context.next());
}



export const config = {
  path: "/power-breakdown",
  excludedPath: ["/static/*"],
}
