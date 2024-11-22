import { HTMLRewriter } from "html-rewriter";

export const gridAwareRewriter = (gridData, method) => {
    return new HTMLRewriter()
        .on('html', {
            element(element) {
                element.setAttribute('data-grid-aware', 'true');
            },
        })
        .on('span#page-color', {
            element(element) {
                element.setInnerContent('dark mode');
            },
        })
        .on('span#cleaner-dirtier', {
            element(element) {
                element.setInnerContent('dirtier than a certain value.');
            },
        })
        .on('#data', {
            element(element) {
                element.setInnerContent(JSON.stringify(gridData, null, 2).trim());
            },
        })
        .on('.platform', {
            element(element) {
                element.setInnerContent('Netlify Edge Functions');
            },
        })
        .on('#font-type', {
            element(element) {
                element.setInnerContent('system font');
            },
        })
        .on('figure > img', {
            element(element) {
                const src = element.getAttribute('src');
                const alt = element.getAttribute('alt');
                element.setAttribute('data-grid-aware-src', src);
                element.removeAttribute('src');
                element.after(`<div class="grid-aware-img-placeholder"><a href="${src}" target="_blank">View original image</a><p>${alt}</p></div>`, { html: true });
            },
        })
        .on('figure > figcaption', {
            element(element) {
                element.remove();
            },
        }).on('#snippet', {
            element(element) {
                element.setInnerContent(netlifySnippet(method));
            },
        }).on('#code-link', {
            element(element) {
                let codeUrl = 'https://github.com/fershad/grid-aware-demo/blob/main/grid-aware-workers/netlify/co2e.js'
                if (method === 'gridAwarePower') {
                    codeUrl = 'https://github.com/fershad/grid-aware-demo/blob/main/grid-aware-workers/netlify/power.js'
                }
                element.before(`<a href="${codeUrl}" target="_blank">View the full code on GitHub</a>`, { html: true });
            },
        })
}

export const regularRewriter = (gridData, method) => {
    return new HTMLRewriter()
        .on('#data', {
            element(element) {
                element.setInnerContent(JSON.stringify(gridData, null, 2).trim());
            },
        })
        .on('.platform', {
            element(element) {
                element.setInnerContent('Netlify Edge Functions');
            },
        })
        .on('#snippet', {
            element(element) {
                element.setInnerContent(netlifySnippet(method));
            },
        }).on('#code-link', {
            element(element) {
                let codeUrl = 'https://github.com/fershad/grid-aware-demo/blob/main/grid-aware-workers/netlify/co2e.js'
                if (method === 'gridAwarePower') {
                    codeUrl = 'https://github.com/fershad/grid-aware-demo/blob/main/grid-aware-workers/netlify/power.js'
                }
                element.before(`<a href="${codeUrl}" target="_blank">View the full code on GitHub</a>`, { html: true });
            },
        })
}

export const netlifySnippet = (method) => {
return `
// Import the things we need from the grid-aware-websites library
import { gridAwarePower } from "https://esm.sh/@greenweb/grid-aware-websites@0.1.0";
import { netlify } from "https://esm.sh/@greenweb/grid-aware-websites@0.1.0/plugins/edge";
import { gridAwareRewriter, regularRewriter } from "./utils/index.js";

export default async (request, context) => {
  let location = netlify.getLocation(context);
	let { country } = location;

    if (!country) {
      const response = await context.next();
			return new Response(response, {
				headers: {
					...response.headers,
					'grid-aware': 'Error - Country not found',
				},
			});
		}

    const gridData = await ${method}(country, Netlify.env.get("EMAPS_API_KEY"));

    if (gridData.status === 'error') {
			const response = await context.next();
			return new Response(response, {
				headers: {
					'grid-aware': 'Error - Unable to fetch grid data',
				},
			});
		}

    // If the gridAware value is set to true, then we need to edit the "data-theme" attribute of the HTML tag to "dark" using the HTmlRewriter
		if (gridData.gridAware) {
			// Create a new HTMLRewriter instance
			// Also add a banner to the top of the page to show that this is a modified page

			const rewriter = gridAwareRewriter(gridData, "${method}");

			// Return the response with the rewriter applied
			return rewriter.transform(await context.next());
		}
    
		const rewriter = regularRewriter(gridData, "${method}");

		return rewriter.transform(await context.next());
}`
}

export { gridAwareRewriter as default };