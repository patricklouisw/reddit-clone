import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react'

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    type: string;
    placeholder: string;
    name: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, size:_, ...props }) => {
    const [field, meta] = useField(props);
    return (
        <FormControl isInvalid={!!meta.error}>
            <FormLabel htmlFor={props.id || props.name}>{label}</FormLabel>
            <Input {...props} {...field}  />
            {meta.touched && meta.error ? (
                <FormErrorMessage>{meta.error}</FormErrorMessage>
            ) : null}
        </FormControl>
    );
}

export default InputField;

