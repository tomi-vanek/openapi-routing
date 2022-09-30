// as an example, let's just respond with incoming data

export async function handleGet(params) {
    return params;
}

export async function handlePost(params, data, contentType) {
    console.log(`Content type = ${contentType}`);

    return (data && contentType && contentType.toLowerCase() === 'application/json') ?
            JSON.parse( data.toString() ) :
            data.toString();
}
