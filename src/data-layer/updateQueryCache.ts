import { QueryInput, Cache } from "@urql/exchange-graphcache";

function updateQueryCache<Result, Query>(
  cache: Cache,
  query: QueryInput,
  result: Result,
  callbackFn: (r: Result, q: Query | null) => Query | null
) {
  cache.updateQuery<Query>(query, (data) => callbackFn(result, data));
}

export default updateQueryCache;
