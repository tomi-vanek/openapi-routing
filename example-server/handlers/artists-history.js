// as an example, let's just respond with incoming data
export async function handleGet(params) {
    return {
        action: 'artists-history',
        timestamp: new Date().toISOString(),
        ...params,
    };
}
