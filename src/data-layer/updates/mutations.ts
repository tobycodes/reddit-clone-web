import { UpdatesConfig } from "@urql/exchange-graphcache";

import updateQueryCache from "data-layer/updateQueryCache";
import {
  LogoutMutation,
  MeDocument,
  LoginMutation,
  MeQuery,
  RegisterMutation,
  ChangePasswordMutation,
} from "@generated/graphql";
import { isErrorStatus } from "@utils/isErrorStatus";

type MutationUpdates = UpdatesConfig["Mutation"];

const MUTATION_UPDATES: MutationUpdates = {
  logout: (result: LogoutMutation, _, cache) => {
    cache.updateQuery({ query: MeDocument }, () => ({
      me: { ...result.logout, user: null },
    }));
  },
  login: (result: LoginMutation, _, cache) => {
    updateQueryCache<LoginMutation, MeQuery>(
      cache,
      { query: MeDocument },
      result,
      (result, data) => {
        if (isErrorStatus(result.login.status)) {
          return data;
        }

        return { me: result.login };
      }
    );
  },
  register: (result: RegisterMutation, _, cache) => {
    updateQueryCache<RegisterMutation, MeQuery>(
      cache,
      { query: MeDocument },
      result,
      (result, data) => {
        if (isErrorStatus(result.register.status)) {
          return data;
        }

        return { me: result.register };
      }
    );
  },
  changePassword: (result: ChangePasswordMutation, _, cache) => {
    updateQueryCache<ChangePasswordMutation, MeQuery>(
      cache,
      { query: MeDocument },
      result,
      (result, data) => {
        if (isErrorStatus(result.changePassword.status)) {
          return data;
        }

        return { me: result.changePassword };
      }
    );
  },
  createPost: (_: any, _2, cache) => {
    const allFields = cache.inspectFields("Query");
    const fieldInfos = allFields.filter((x) => x.fieldName === "posts");

    fieldInfos.forEach((f) => {
      cache.invalidate("Query", "posts", f.arguments);
    });
  },
};

export default MUTATION_UPDATES;
