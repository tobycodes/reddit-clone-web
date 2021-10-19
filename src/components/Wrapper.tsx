import { FC } from "react";
import { Box } from "@chakra-ui/react";

const maxWidths = { small: "400px", medium: "600px", regular: "800px" };

interface WrapperProps {
  variant: "small" | "medium" | "regular";
}

export const Wrapper: FC<WrapperProps> = ({
  children,
  variant = "regular",
}) => {
  return (
    <Box py={6} px={12} mx="auto" maxW={maxWidths[variant]} w="100%">
      {children}
    </Box>
  );
};
