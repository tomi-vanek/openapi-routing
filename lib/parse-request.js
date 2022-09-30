// Transform number and boolean values from incoming string:
export function normalizedParamEntities(params) {
    return [...params].map(x =>
        !isNaN(x[1]) ? [x[0], x[1] * 1]
            : ['true', 'false'].includes(String(x[1]).toLowerCase()) ? [x[0], String(x[1]).toLowerCase() === 'true']
                : x
    );
}

export async function parseRequest(req) {
    const { url, method, headers } = req;
    const { pathname, searchParams } = new URL(req.url.startsWith('http') ? url : 'http://localhost' + url);
    const cookie = headers.cookie ? parseCookie(headers.cookie) : {};
    const dataInBody = await readRequestData(req);
    // const data = dataInBody ? JSON.parse( dataInBody ) : dataInBody;
    const data = dataInBody;
    const contentType = getParameterCaseInsensitive(headers, 'content-type');

    return {
        url,
        method,
        pathname: pathname.toString(),
        searchParams: Object.fromEntries(normalizedParamEntities(searchParams.entries())),
        headers,
        cookie,
        data,
        contentType,
    };
}

// https://stackoverflow.com/questions/12484386/access-javascript-property-case-insensitively
function getParameterCaseInsensitive(object, key) {
    const asLowercase = key.toLowerCase();
    return object[Object.keys(object)
        .find(k => k.toLowerCase() === asLowercase)
    ];
}

async function readRequestData(req) {
    const buffers = [];
    for await (const chunk of req) {
        buffers.push(chunk);
    }
    return Buffer.concat(buffers).toString();
}

function parseCookie(value) {
    // https://www.30secondsofcode.org/js/s/parse-cookie
    return value
        .split(';')
        .map(v => v.split('='))
        .reduce((acc, v) => {
            acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
            return acc;
        }, {});
}
