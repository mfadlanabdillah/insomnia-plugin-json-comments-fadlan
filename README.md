# insomnia-plugin-json-comments-fadlan

Insomnia plugin that allows you to write JSON with **comments** (`//` and `/* */`) in request bodies.

Comments are automatically stripped before the request is sent to the server. Also supports **trailing commas**.

## Example

```json
{
  "page": 1, // current page
  "page_size": 10, /* page size */
  "sort_by": "lastModifiedDate",
  "sort_order": "DESC",
  "filters": {
    "status": "active" // status filter
  }
}
```

## Installation

### Via Insomnia Plugin Hub

1. Open Insomnia → **Preferences** (Ctrl+,)
2. Go to **Plugins** tab
3. Search for `json-comments-fadlan`
4. Click **Install**

### Via npm

```bash
npm install -g insomnia-plugin-json-comments-fadlan
```

### Manual

Copy the folder to the Insomnia plugins directory:

- **Windows**: `%APPDATA%\Insomnia\plugins\`
- **Mac**: `~/Library/Application Support/Insomnia/plugins/`
- **Linux**: `~/.config/Insomnia/plugins/`

## Features

- **Auto-strip comments** — `//` and `/* */` comments are removed before sending
- **Trailing comma support** — trailing commas after last item are fixed

## How It Works

The plugin uses `requestHooks` that run before each request is sent. All `//` inline comments and `/* */` block comments are removed from the JSON body, along with any trailing commas.

## License

MIT
