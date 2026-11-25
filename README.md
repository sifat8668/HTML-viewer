# HTML Viewer

A fast, private HTML, CSS and JavaScript editor with a live preview. It runs entirely in your browser, works offline, installs like an app, and is built to stay responsive on low-end Android phones.

**Live site:** https://sifat8668.github.io/HTML-viewer/

Your code never leaves your device. The one exception is a share link, which contains the code itself, so anyone you give the link to can read it.

## What it does

### Editor
- Syntax colouring for HTML, CSS and JavaScript. Only the visible lines are drawn, so large files stay smooth.
- Automatic indentation, auto-closing tags and brackets, suggestions (Ctrl+Space) and comment toggling (Ctrl+/).
- Line numbers with error, warning and tip markers.
- **Bracket matching and HTML tag-pair matching.** Put the cursor next to a bracket or inside a tag and its partner lights up.
- Several editors in one session. Add, rename, duplicate and close them from the menu.
- **Find and replace** with previous / next (and "3 of 12" counting), match case, whole word, regular expressions and `$1` group references in the replacement.
- Go to line, undo and redo, adjustable text size.
- Large files: live checking pauses above about 300,000 characters (Find mistakes still works on demand), files over 5 MB ask before opening, and binary files are refused with a clear message.

### Preview
- Full-screen preview, a floating preview, and a **split view** (side by side on wide screens, stacked on tall ones) with a draggable divider and automatic refresh while you type.
- Size presets for phone, tablet and desktop, custom width and height, rotate, zoom in and out, Fit, browser full screen and a refresh button.
- The floating preview remembers where you put it and always stays on screen.

### Finding mistakes
Results are grouped into **errors** (things that break the page), **warnings** (probably a mistake) and **tips** (worth a look), with line numbers, plus column numbers for HTML and JavaScript. Press Alt+Shift+C or use the menu.

- HTML structure: missing or mismatched closing tags, duplicate ids and more.
- CSS: unknown properties, bad values and broken syntax.
- JavaScript: syntax errors, found by parsing the code without running it.
- **New:** a warning when a function is called but never defined anywhere in your JavaScript.

The checker is deliberately cautious. The undefined-function warning stays silent when the HTML loads an external script, when the name appears in your HTML, or when the code uses patterns it cannot follow, because a false alarm costs more trust than a missed one. It never reports a style preference as an error.

### Developer tools (open them from the preview)
- **Console.** Shows `console.log`, `info`, `warn` and `error`, uncaught errors, unhandled promise rejections and files that failed to load. Tap an error to jump to its line in your JavaScript tab. A command line runs JavaScript inside the preview.
- **Inspector.** Tap *Pick element*, then tap anything in the preview to see its path, its HTML, the CSS rules from your code that apply to it and its computed values. *Select parent* walks up the tree and *Show in code* jumps to the tag in your HTML tab (it matches by tag order, so elements created by JavaScript cannot be located).
- **Code statistics** (Alt+Shift+I): lines, characters, words and bytes per tab, plus tag, id, image, CSS block and function counts.
- **Format code** (Alt+Shift+F) and **Minify code** (Alt+Shift+M). Minify is conservative: it removes comments and extra spaces, keeps line breaks in JavaScript so nothing can change meaning, and refuses to run if the result would not parse. Undo restores the original.

### Reliability and safety
- **Isolated preview.** Previews run in sandboxed frames without access to the editor's origin, so preview code cannot read your saved code, settings or storage. Messages from the preview are accepted only from the preview frame and are displayed as plain text.
- No referrer is sent from the editor or the previews.
- **Autosave with recovery.** A recovery copy is kept for the current browser session, so a reload or a killed background tab brings your work back. It is cleared when you close the tab. Turn on *Keep code on reopen* to keep your code across sessions.
- A warning appears before leaving the page with changes you have not exported. Clearing everything and closing an editor ask first.
- **Recent files:** the last eight files you imported (up to 300 KB each) are one tap away. They are remembered for the session, or longer if *Keep code on reopen* is on.
- Offline support through a service worker, an update notice when a new version is ready, offline and online notices, and install help for iPhone and iPad (Share, then Add to Home Screen).

## Keyboard shortcuts

On Mac, use Cmd instead of Ctrl.

| Action | Shortcut |
| --- | --- |
| Preview | Ctrl+Enter |
| Save as a file | Ctrl+S |
| Find and replace | Ctrl+F or Ctrl+H |
| Go to line | Ctrl+G |
| Find mistakes | Alt+Shift+C |
| Format code | Alt+Shift+F |
| Minify code | Alt+Shift+M |
| Code statistics | Alt+Shift+I |
| Recent files | Alt+Shift+R |
| Split view preview | Alt+Shift+P |
| Suggestions | Ctrl+Space |
| Comment or uncomment | Ctrl+/ |
| Leave the editor with the keyboard | Esc, then Tab |

In split view, Ctrl+Enter refreshes the preview and the divider can be moved with the arrow keys.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The whole app: markup, styles and scripts in one file |
| `service-worker.js` | Offline support and background updates |
| `manifest.json` | Install metadata |
| `about.html` | About page |
| `icon.png`, `icons/` | App icons |
| `README.md` | This file |
| `LICENSE.txt` | MIT License |

## Run it locally

No build step is needed. Serve the folder over HTTP (service workers do not run from `file://`):

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000. To publish, push the files to a GitHub repository and turn on GitHub Pages for the main branch.

After you publish a new version, the service worker downloads it in the background. The page shows "Update ready" and the new version appears on the next reload.

## Browser support

Current Chrome, Edge, Firefox and Safari, including Android and iOS. Split view, the inspector and full screen need a modern browser. Full screen is not available in every mobile browser.

## Known limits

- Minify is a safe whitespace and comment remover, not a full JavaScript minifier.
- Column numbers are shown for HTML and JavaScript findings. CSS findings show the line.
- Show in code matches elements by tag order, so it can be off for pages that rebuild their own HTML.
- The preview is sandboxed on purpose, so code that needs cookies or storage shared with the editor will not work there.

## Contributing

Bug reports and ideas are welcome: https://github.com/sifat8668/HTML-viewer/issues

Please keep changes small and test on a phone. The goal is a tool that stays fast and honest on modest hardware.

## License

MIT. See `LICENSE.txt`.
