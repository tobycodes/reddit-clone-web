import { useColorMode, Switch } from "@chakra-ui/react";

export const DarkModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <Switch
      display="flex"
      alignItems="center"
      color="green"
      isChecked={isDark}
      onChange={toggleColorMode}
    />
  );
};
