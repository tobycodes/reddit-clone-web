import { FieldError } from "@generated/graphql";

type Errors = Omit<FieldError, "__typename">;

export const generateErrorMap = (errors: Errors[]) => {
  const errorObj: Record<string, string> = {};

  errors.forEach(({ name, message }) => (errorObj[name] = message));

  return errorObj;
};
