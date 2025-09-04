# Tait Media Solutions Website

## Best Practices

- Instant navigation: the best of CSR + SSR in one. SSR your first page for fastest possible initial load times. For subsequent pages, the content is pre-loaded and rendered with CSR, for instant rendering.
- CDN optimized, for high edge-cache hit ratios
- Svelte and Tailwind compile out unused HTML, CSS and JS at deploy time for smaller pages
- Linting to find accessibility and syntax issues

### Developer Environment

The repo includes [CI scripts](https://aws.amazon.com/devops/continuous-integration/) designed for [GitHub Actions](https://github.com/features/actions). These confirm you don’t break your [build](https://github.com/kizivat/saas-kit/blob/main/.github/workflows/build.yml), you use [proper code formatting](https://github.com/kizivat/saas-kit/blob/main/.github/workflows/format.yml), and [code linting and typechecking passes](https://github.com/kizivat/saas-kit/blob/main/.github/workflows/linting.yml).

You can manually run these scripts yourself; `npm run build` for the build, `npm run format:check` to check formatting, `npm run lint` for the linting, `npm run check` for typechecking, and `npm run test` for testing (if you add tests).

To catch build, formatting, linting and test issues before you commit changes, we suggest the following local git hook. It will run before you commit, stop you from breaking the build, and show any issues that are found. Add the lines below to an executable git hook script at the location `.git/hooks/pre-commit`.

```
#!/bin/sh
set -e
npm run format:check
npm run lint
npm run build
npm run check
npm run test
```

### Custom content

After the steps above, you’ll have a working version like the demo page. However, it’s not branded, and doesn’t have your content. The following checklist helps you customize the template to make a SaaS homepage for your company.

- [ ] Set a name for your site in `src/config.ts:WebsiteName`
- [ ] Content
  - [ ] Add actual content for marketing homepage
  - [ ] Add any pages you want on top of our boiler plate (about, terms of service, etc). Be sure to add links to them in the header, mobile menu header, and footer as appropriate (`src/routes/(marketing)/+layout.svelte`).
- [ ] Update SEO content
  - [ ] Update title and meta description tags for every public page. We include generic ones using your site name (`src/config.ts:WebsiteName`), but the more specific these are the better.
- [ ] Style
  - [ ] Create or paste your shadcn-svelte theme matching your brand (see `src/app.css`)
  - [ ] Update the marketing page layout `src/routes/(marketing)/+layout.svelte`: customize design, delete unwanted pages from header and footer
  - [ ] Update the favicon in the `/static/` directory
- [ ] Functionality
  - [ ] Add actual SaaS functionality!
  - [ ] Replace the admin dashboard with real content (`/src/routes/(app)/dasboard/+page.svelte`).
  - [ ] Add API endpoints and database tables as needed to deliver your SaaS product.
