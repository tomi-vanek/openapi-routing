// as an example just respond with incoming data

export async function handleGet (params) {
  return {
    action: 'artists/{username}',
    timestamp: new Date().toISOString(),
    ...params
  }
}
