type Status = "success" | "error" | "fail";

export const isErrorStatus = (status: Status | string) =>
  status === "error" || status === "fail";
