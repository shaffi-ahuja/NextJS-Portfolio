/**
 * Redis Mock
 * Place at: src/__tests__/mocks/redis.mock.ts
 */

export const createRedisMock = () => {
  const data = new Map<string, any>();
  const sets = new Map<string, Set<string>>();

  return {
    set: jest.fn(async (key: string, value: any) => {
      data.set(key, value);
      return 'OK';
    }),
    get: jest.fn(async (key: string) => {
      return data.get(key) ?? null;
    }),
    del: jest.fn(async (key: string) => {
      data.delete(key);
      return 1;
    }),
    incr: jest.fn(async (key: string) => {
      const current = data.get(key) ?? 0;
      const next = parseInt(current) + 1;
      data.set(key, next.toString());
      return next;
    }),
    sadd: jest.fn(async (key: string, member: string) => {
      if (!sets.has(key)) sets.set(key, new Set());
      sets.get(key)!.add(member);
      return 1;
    }),
    sismember: jest.fn(async (key: string, member: string) => {
      return sets.has(key) && sets.get(key)!.has(member) ? 1 : 0;
    }),
    smembers: jest.fn(async (key: string) => {
      return Array.from(sets.get(key) ?? new Set());
    }),
    srem: jest.fn(async (key: string, member: string) => {
      const set = sets.get(key);
      if (!set) return 0;
      return set.delete(member) ? 1 : 0;
    }),
    getdata: () => data,
    getsets: () => sets,
    clear: () => {
      data.clear();
      sets.clear();
    },
  };
};

export type RedisMock = ReturnType<typeof createRedisMock>;
