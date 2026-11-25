# Deploy the storefront

Pick one production URL and keep it in `src/config.json` as `siteBaseUrl`, including the project path if there is one. For example, use `https://USERNAME.github.io/REPO/` on a GitHub Pages project or `https://PROJECT.pages.dev/` on Cloudflare Pages.

## GitHub Pages

1. Create a public GitHub repository on the free plan and push the project root containing `site/` and `content/` to `main`.
2. In the repository, choose **Settings → Pages → Build and deployment → Source → GitHub Actions**.
3. Set the GitHub Pages URL in `site/src/config.json`. Copy `site/.github/workflows/pages.yml` to `.github/workflows/pages.yml` at the repository root and commit it. GitHub discovers workflows from that directory.
4. Push to `main` or use **Actions → Deploy static site to GitHub Pages → Run workflow**. Open the deployment URL, then check the homepage, reveal link and custom 404. [GitHub Pages custom workflow docs](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

For a project-path site, submit the project’s sitemap directly. The origin-level `/robots.txt` belongs to the root of the GitHub Pages hostname, so the project’s generated `robots.txt` is only served under the repository path. If you control the hostname’s root site, you can list the project sitemap in its `robots.txt`.

## Cloudflare Pages

1. In **Workers & Pages**, create a **Pages** project and import the Git repository.
2. Select the production branch, leave the framework preset as **None**, use the repository root, set the build command to `node site/build.mjs`, and set the output directory to `site/dist`.
3. Set `siteBaseUrl` to the assigned `pages.dev` URL and deploy again. For manual deployment, build locally and use the Pages Direct Upload workflow with the contents of `site/dist/`. [Cloudflare Pages static HTML docs](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/) · [Direct Upload docs](https://developers.cloudflare.com/pages/get-started/direct-upload/)

## Analytics and search

1. Create a free personal GoatCounter site and set `goatCounterCode` to its subdomain label. In GoatCounter settings, enable public dashboard viewing. Rebuild and redeploy, then open `/stats/` relative to the site root and check the dashboard while signed out. The site sends cookieless count requests with a known page path or event name and the referrer origin for pageviews. [GoatCounter count endpoint](https://www.goatcounter.com/help/pixel) · [GoatCounter public dashboard](https://www.goatcounter.com/help/frame)
2. On the production hostname, open the homepage, try a buy button, wait a second, and use Share. Check for the page path and events in GoatCounter. Analytics honor Do Not Track and Global Privacy Control and are disabled on origins other than the canonical origin.
3. Add the exact deployed URL as a **URL prefix** property in Google Search Console. Copy the value from the HTML verification tag into `googleSiteVerification`. Add the site in Bing Webmaster Tools and copy the HTML tag value into `bingSiteVerification`, or import the verified property from Search Console.
4. Rebuild and redeploy before completing verification. Submit the absolute URL for `sitemap.xml` to each dashboard. Keep the verification values configured for future ownership checks. [Google verification instructions](https://support.google.com/webmasters/answer/9008080) · [Bing sitemap instructions](https://www2.bing.com/webmasters/help/sitemaps-3b5cf6ed)
5. For optional IndexNow support, set a valid `indexNowKey`. The build publishes `<key>.txt` at the site root. Use its absolute URL as `keyLocation` when submitting changed URLs, especially on GitHub Pages project paths. [IndexNow documentation](https://www.indexnow.org/documentation)
