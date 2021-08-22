interface Dictionary<T> {
  [key: string]: T
}

export function stubKeyValueStore() {
  const store: Dictionary<String> = {}

  return {
    put: (key: string, value: string) => (store[key] = value),
    list: ({ prefix }: { prefix: string }) =>
      Promise.resolve({
        keys: Object.keys(store)
          .filter((key) => key.startsWith(prefix))
          .map((name) => ({ name })),
      }),
    get: (key: string) => Promise.resolve(store[key]),
  }
}
