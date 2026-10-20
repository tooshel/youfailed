# you failed.

The blog of Jim deVos & Sheldon McGee, 2005–present. One hundred posts
survived WordPress (resurrected from the multisite database dump after the
live site white-screened); everything from here on is plain markdown.

Live at https://www.youfailed.us/ (GitHub Pages, deploy-from-branch `main`,
folder `/docs`).

## How to publish a post

1. Drop a file in `posts/`, named whatever you like (`my-new-post.md`):

   ```markdown
   ---
   title: The thing that went wrong this time
   slug: the-thing-that-went-wrong
   date: 2026-10-20 09:00:00
   author: Sheldon
   ---

   Regular **markdown**. Paragraphs, `code`, [links](https://example.com),
   images, lists, > quotes, and ``` fenced code blocks all work.
   ```

2. `node tools/build.js`
3. Commit and push. Pages redeploys automatically.

Or: paste the markdown to Claude and say "publish this" — same result.

## Layout

- `content/legacy.json` — the resurrected WordPress archive (100 posts +
  About page). Don't edit; it's history.
- `posts/*.md` — the new era. One file per post, front matter + markdown.
- `tools/build.js` — zero-dependency static generator. Renders everything
  into `docs/`: index grouped by year, one folder per post (slugs match the
  old WordPress permalinks, so twenty years of links still work), About,
  RSS at `/feed.xml`, 404.
- `docs/` — generated output. Never edit by hand.

- `media/` — images for new posts. Anything here is copied to `/files/` on
  build, so reference it from markdown as `![caption](/files/my-image.jpg)`.

Media for legacy posts was copied from the NFSN backup (`blogs.dir/70/files`)
and lives in the repo so the site has no dependency on any old server.
