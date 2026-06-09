const JSON_MIME = ['application/json', 'text/plain', 'application/vnd.api+json'];

function stripJsonComments(jsonString) {
  let insideString = false;
  let result = '';
  let i = 0;

  while (i < jsonString.length) {
    const ch = jsonString[i];
    const next = jsonString[i + 1];

    if (!insideString) {
      if (ch === '/' && next === '/') {
        while (i < jsonString.length && jsonString[i] !== '\n') {
          i++;
        }
        continue;
      }

      if (ch === '/' && next === '*') {
        i += 2;
        while (i < jsonString.length && !(jsonString[i] === '*' && jsonString[i + 1] === '/')) {
          i++;
        }
        i += 2;
        continue;
      }

      if (ch === ',' && next && next !== '{' && next !== '[') {
        let j = i + 1;
        while (j < jsonString.length && (jsonString[j] === ' ' || jsonString[j] === '\n' || jsonString[j] === '\r' || jsonString[j] === '\t')) {
          j++;
        }
        if (jsonString[j] === '}' || jsonString[j] === ']') {
          result += ' ';
          i++;
          continue;
        }
      }
    }

    if (ch === '"' && jsonString[i - 1] !== '\\') {
      insideString = !insideString;
    }

    result += ch;
    i++;
  }

  return result;
}

module.exports.stripJsonComments = stripJsonComments;
module.exports.requestHooks = [
  async (context) => {
    const request = context.request;
    const body = request.getBody();

    if (body && body.text && body.text.trim().startsWith('{')) {
      const mime = (body.mimeType || '').toLowerCase();
      const isJson = JSON_MIME.includes(mime) || mime.endsWith('+json') || mime.endsWith('/json');

      if (isJson) {
        try {
          const cleaned = stripJsonComments(body.text);
          request.setBody({
            mimeType: body.mimeType,
            text: cleaned
          });
        } catch (err) {
          console.warn('[json-comments] Gagal strip comments:', err.message);
        }
      }
    }
  }
];


