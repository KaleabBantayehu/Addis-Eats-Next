export function createBuildPlaceholderClient() {
  function createQuery() {
    const query = {
      select() {
        return query;
      },
      eq() {
        return query;
      },
      order() {
        return query;
      },
      maybeSingle() {
        return Promise.resolve({ data: null, error: null });
      },
      then(resolve, reject) {
        return Promise.resolve({ data: [], error: null }).then(resolve, reject);
      },
    };

    return query;
  }

  return {
    auth: {
      getClaims: async () => ({ data: { claims: null }, error: null }),
    },
    from: createQuery,
  };
}
