export const gridAwareRewriter = (gridData) => {
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
        .on('#platform', {
            element(element) {
                element.setInnerContent('Cloudflare Workers');
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
        });
}
