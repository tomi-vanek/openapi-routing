// as an example, let's just respond with incoming data
export async function handleGet (params) {
  return {
    action: 'artists',
    timestamp: new Date().toISOString(),
    ...params
  }
}

export async function handlePost (params, data, contentType) {
  console.log(`Content type = ${contentType}`)

  const isJson = data && contentType && contentType.toLowerCase() === 'application/json'

  if (!isJson) {
    return data ? data.toString() : ''
  }

  const dataObject = JSON.parse(data.toString())

  if (dataObject.error) {
    const error = new Error(dataObject.error)
    error.status = 400
    throw error
  }

  return dataObject
}
