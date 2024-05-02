interface Dictionary<T> {
  [key: string]: T
}

export interface KeyValueStore {
  put: (key: string, value: string) => void
  list: ({
    prefix,
  }: {
    prefix: string
  }) => Promise<{ keys: { name: string }[] }>
  get: (key: string) => Promise<string>
}

export function stubKeyValueStore(): KeyValueStore {
  const store: Dictionary<string> = {}

  return {
    put: (key: string, value: string) => {
      store[key] = value
    },
    list: ({ prefix }: { prefix: string }) =>
      Promise.resolve({
        keys: Object.keys(store)
          .filter((key) => key.startsWith(prefix))
          .map((name) => ({ name })),
      }),
    get: (key: string) => Promise.resolve(store[key] ?? null),
  }
}
