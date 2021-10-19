import { stringifyVariables } from "@urql/core";
import { Resolver } from "@urql/exchange-graphcache";

export const cursorPagination = (): Resolver => (_root, args, cache, info) => {
  const { fieldName, parentKey: entityKey } = info;
  const allFields = cache.inspectFields(entityKey);
  const fieldInfos = allFields.filter((x) => x.fieldName === fieldName);
  const size = fieldInfos.length;

  if (size === 0) return undefined;

  const fieldKey = `${fieldName}(${stringifyVariables(args)})`;
  const cacheKey = cache.resolve(entityKey, fieldKey);
  const isInCache = cache.resolve(cacheKey as string, "posts");

  // Check if items are in cache to determine if we make new call
  info.partial = !!isInCache;

  const results: string[] = [];

  fieldInfos.forEach((f) => {
    const key = cache.resolve(entityKey, f.fieldKey) as string;
    const data = cache.resolve(key, "posts") as string[];

    if (Array.isArray(data)) {
      results.push(...data);
    }
  });

  return results;
};
