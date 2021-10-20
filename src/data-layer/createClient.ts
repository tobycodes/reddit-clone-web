import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import isProd from "@utils/isProd";

const SERVER_URL = isProd()
  ? "server_prod_url"
  : "http://localhost:4000/graphql";

export const client = new ApolloClient({
  link: createHttpLink({
    uri: SERVER_URL,
    credentials: "include",
  }),
  cache: new InMemoryCache(),
  name: "RedLab",
});
