import { InputHTMLAttributes, FC } from "react";
import { useField } from "formik";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Textarea,
  Box,
} from "@chakra-ui/react";

type InputFieldProps = InputHTMLAttributes<
  HTMLTextAreaElement | HTMLInputElement
> & {
  name: string;
  label: string;
  placeholder: string;
  textarea?: boolean;
  rows?: number;
};

const InputField: FC<InputFieldProps> = ({
  type,
  textarea,
  label,
  placeholder,
  rows,
  ...props
}) => {
  const [field, { error }] = useField(props);

  const InputComp = textarea ? Textarea : Input;

  return (
    <Box mb={4}>
      <FormControl isInvalid={!!error}>
        <FormLabel htmlFor={field.name}>{label}</FormLabel>
        <InputComp
          {...field}
          id={field.name}
          placeholder={placeholder}
          type={type}
          rows={rows}
        />
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </FormControl>
    </Box>
  );
};

export default InputField;
