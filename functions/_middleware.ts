import { Context } from 'hono'

export async function onRequest(context: Context) {
  const response = await context.next()
  response.headers.set('Access-Control-Allow-Origin', '*')
  return response
}
