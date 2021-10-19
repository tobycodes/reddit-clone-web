import { SSRExchange } from "next-urql";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { dedupExchange, fetchExchange, ClientOptions } from "@urql/core";
import { cacheExchange } from "@urql/exchange-graphcache";
import { devtoolsExchange } from "@urql/devtools";
import mutationUpdates from "./updates/mutations";
import isProd from "@utils/isProd";

const cacheUpdates = { Mutation: mutationUpdates };

const SERVER_URL = isProd()
  ? "server_prod_url"
  : "http://localhost:4000/graphql";

const createUrqlClient = (ssrExchange: SSRExchange): ClientOptions => ({
  url: SERVER_URL,
  fetchOptions: { credentials: "include" },
  exchanges: [
    devtoolsExchange,
    dedupExchange,
    cacheExchange({
      keys: {},
      updates: cacheUpdates,
      resolvers: {
        Query: {},
      },
    }),
    ssrExchange,
    fetchExchange,
  ],
});

export const client = new ApolloClient({
  link: createHttpLink({
    uri: SERVER_URL,
    credentials: "include",
  }),
  cache: new InMemoryCache(),
  name: "RedLab",
});

export default createUrqlClient;
