# usp-search-frontend

Standalone React widget for SearchApplication / BhaktiGanga Tinglish search.
Builds to a single self-contained `usp-search.umd.js` for drop-in
`<script src>` integration via [jsDelivr](https://www.jsdelivr.com/).

## What you get

- One file, ~110 KB gzipped over the wire (React + ReactDOM + MUI +
  components all bundled in).
- CSS injected at runtime — no second tag needed.
- Runtime config via `window.APP_CONFIG` so the same bundle works in
  any environment without rebuild.
- Versioned URLs via git tags (jsDelivr maps tags → URLs).

## PHP integration

Drop these into your PHP template (any page where you want the widget):

```html
<!-- 1. Host config — injected per environment -->
<script>
  window.APP_CONFIG = {
    apiBase: "<?= htmlspecialchars($_ENV['SEARCH_API_BASE']
                                  ?? 'https://your-spring-boot-host.example.com') ?>",
    heroImage: "/path/to/your/hero-image.webp"  // optional
  };
</script>

<!-- 2. Mount point — the widget renders here -->
<div id="usp-search-root"></div>

<!-- 3. The widget bundle from jsDelivr (pinned to a version tag) -->
<script src="https://cdn.jsdelivr.net/gh/NavaUchiha/usp-search-frontend@v0.1.0/dist/usp-search.umd.js"></script>
```

Update the URL's `@v0.1.0` to a newer tag when you publish a release.
Pin to specific tags — never use `@main` in production (jsDelivr caches
URLs aggressively; tags give you predictable cache busting).

## Runtime config (`window.APP_CONFIG`)

| Key         | Required | Description                                                                                  |
|-------------|----------|----------------------------------------------------------------------------------------------|
| `apiBase`   | Yes      | Base URL the widget calls. Exact meaning depends on `apiStyle` (see below).                   |
| `apiStyle`  | No       | `"query"` (default) or `"path"`. Selects the URL shape. Default keeps existing PHP-proxy deployments working unchanged. |
| `heroImage` | No       | Absolute URL for the hero image. If omitted, no image is rendered.                            |

### `apiStyle` — two integration shapes from one bundle

| `apiStyle` | URL the widget builds                                                                | Use with                                                                                  |
|------------|--------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------|
| `"query"`  | `${apiBase}?query=<text>[&mode=poetry\|&mode=semantic]`                               | The PHP proxy (`search_api_proxy.php`) that reads `$_GET['query']`.                        |
| `"path"`   | `${apiBase}/searchTemplate/<text>`, `/searchPoetry/<text>`, `/searchSemantic/<text>` | A same-origin nginx reverse-proxying those paths to Spring Boot, or Spring Boot directly. Use `apiBase: "."` for same-origin. |

The **Search mode** radio picks the route: **Normal** (`/searchTemplate`, lexical),
**Semantic** (`/searchSemantic`, kNN vector search — requires the embed-service to be running),
and **Bhakthi Ganga** (`/searchPoetry`). In `"query"` style these map to the `mode=` flag, which
the proxy must understand.

## Manual mounting

The widget auto-mounts into `#usp-search-root` on `DOMContentLoaded`. If
you need to mount into a different element or remount later:

```javascript
window.USPSearch.mount("my-custom-mount-id");
// or
window.USPSearch.mount(document.getElementById("my-element"));
```

## Local development

```bash
npm install
npm run dev      # Vite dev server on http://localhost:5173
npm run build    # Produces dist/usp-search.umd.js
```

Test the built bundle:

```bash
cd dist
python3 -m http.server 5174
# open http://localhost:5174/test.html
```

## Releasing a new version

```bash
# 1. Bump version in package.json
# 2. Rebuild
npm run build

# 3. Commit dist/ + sources
git add -A
git commit -m "release: v0.2.0"

# 4. Tag and push
git tag v0.2.0
git push origin main --tags

# 5. jsDelivr URL for the new tag is live immediately:
#    https://cdn.jsdelivr.net/gh/NavaUchiha/usp-search-frontend@v0.2.0/dist/usp-search.umd.js
```

## Why is the built bundle committed?

jsDelivr serves files directly from git tags. To make the bundle
available at `cdn.jsdelivr.net/gh/<repo>@<tag>/dist/usp-search.umd.js`,
the `dist/` folder must exist in the tagged commit. Hence the
`.gitignore` does NOT exclude `dist/`.
