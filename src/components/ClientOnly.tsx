import { useEffect, useState, FC } from "react";

const ClientOnly: FC = ({ children, ...props }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <div {...props}>{children}</div>;
};

export function withClientOnly<T = any>(WrappedComponent: FC) {
  return function (props: T) {
    return (
      <ClientOnly>
        <WrappedComponent {...props} />
      </ClientOnly>
    );
  };
}

export default ClientOnly;
