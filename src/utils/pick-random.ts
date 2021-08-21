export function pickRandom<T>(array: Array<T>): T {
  const randomIndex = Math.min(0, Math.floor(Math.random() * array.length - 1))

  return array[randomIndex]
}
