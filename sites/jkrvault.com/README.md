# JKR Vault

Collector storefront for https://jkrvault.com. Brand assets and page changes are scoped to this site; shared templates and other sites are unchanged.

## Existing Cloudflare Pages integration

Keep the repository root as the project root, build command `node scripts/build-site.mjs`, output directory `dist`, and `SITE=jkrvault.com`. A push to the configured production branch triggers the existing Git integration. Set the same SITE value for branch preview builds.

Locally, install with `npm ci`, then run from the repository root:

```powershell
$env:SITE = 'jkrvault.com'
node scripts/build-site.mjs
```

The build script clears the repository's `dist` directory before building. Generated `.astro` files are already tracked in this repository; exclude unrelated generated-file changes from commits.

## Inventory and links

Public data lives in `public/vault/data.js`. The launch catalog is empty: the home page shows four collecting-interest illustrations and links to the actual eBay profile. These are not listings and do not claim stock, prices, grades, or sales.

Adding real catalog records automatically displays search, category/status filters, and item dialogs in place of the category artwork. Example shape, with placeholders that MUST be replaced before use:

```js
{
  id: 'JKR-000001',
  title: 'Actual year, set, player and card number',
  category: 'Baseball', // Baseball, Basketball, Football, or Memorabilia
  detail: 'Verified condition or grader and grade',
  status: 'Available', // or Personal collection or Sold
  price: null, // null = Price on eBay; numeric amounts are USD
  image: 'vault/items/jkr-000001-front.webp',
  ebayUrl: 'https://www.ebay.com/itm/REPLACE_WITH_REAL_ITEM_ID',
  sample: false,
  notes: 'Observed condition and supported certification details.'
}
```

Store owned photos in `public/vault/items/` with lowercase filenames without spaces. Complete condition photography belongs in the live eBay listing. Only real Available records with an allowed eBay URL show a purchase link. Sold and personal pieces do not. Production excludes `sample: true` records. Never add cost basis, storage locations, customer data, tokens, or private notes to public files.

Shared headers give `/assets/*` immutable caching. This site's editable assets use `/vault/` so catalog data, scripts, and styles do not inherit that year-long rule. Existing shared headers and redirects are preserved by the build.

## Contact / free Cloudflare forwarding

`links.contact` is blank until forwarding is confirmed. The site sends listing questions to eBay and explains that general contact options are pending.

1. Open Email Routing in the Cloudflare zone for jkrvault.com.
2. Add the owner's chosen existing inbox as a destination; complete Cloudflare's verification email.
3. Review existing mail DNS before enabling routing records. Preserve existing mail services until a migration is intended.
4. Create the chosen address, such as hello@jkrvault.com, forwarding to the verified destination.
5. Send a test from a separate account and confirm receipt.
6. Set `links.contact` to the verified `mailto:` address and deploy. The pending-contact box hides when all three account links are valid.

Forwarding alone does not supply an outbound branded mailbox. Replies normally use the destination account's sender address unless a separate authenticated sending service is configured.

## Validation

Build JKR Vault, check `/` and `/about/`, verify account destinations and narrow-screen layouts, and confirm there are no demo listings or indexing blocks. With real catalog fixtures, verify filters and dialogs. Review the Cloudflare deployment result for the exact commit before reporting the update live.
