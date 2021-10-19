import { useRouter } from "next/router";

type QueryParamOptions = { search?: string };

const useQueryParams = (param?: string, options?: QueryParamOptions) => {
  const router = useRouter();

  const searchParams = new URLSearchParams(options?.search);

  return param ? router.query[param] : searchParams;
};

export default useQueryParams;
