export default async function handler(req: any, res: any) {
  try {
    const result = await fetch('https://jsonplaceholder.typicode.com/users').then(
      async (respanse) => await respanse.json()
    )
    res.statusCode = 200
    res.end(JSON.stringify(result))
  } catch (error) {
    res.statusCode = 500
  }
}
