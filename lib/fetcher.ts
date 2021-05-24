export const fetcher = async (url: string): Promise<unknown> => {
  try {
    const res = await fetch(url)
    const data = await res.json()
    return data
  } catch (e) {
    throw new Error(e.message)
  }
}
