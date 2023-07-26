import React from 'react'
import {
    Button,
    Checkbox,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    VStack
  } from "@chakra-ui/react";
import Wrapper from '../components/Wrapper';
import { Form, Formik, Field } from 'formik';
import * as Yup from 'yup';
import InputField from '../components/InputField';

interface registerProps {

}

const Register: React.FC<registerProps> = ({}) => {
    return (
        <Wrapper variant='small'>
        <Formik
          initialValues={{
            username: "",
            password: ""
          }}
          validationSchema={Yup.object({
            username: Yup.string()
              .min(3, 'Min 3 character')
              .max(15, 'Must be 15 characters or less')
              .matches(/^\S*$/, "No white spaces are allowed.")
              .required('Required'),
            password: Yup.string()
              .min(3, 'Min 3 character')
              .max(15, 'Must be 15 characters or less')
              .required('Required')
          })}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
                console.log("Clicked")
              alert(JSON.stringify(values, null, 2));
              setSubmitting(false);
            }, 400);
          }}
        >
            {({ isSubmitting }) => (
                <Form>
                    <VStack spacing={4} align="flex-start">
                        <InputField 
                        label="Username"
                        name="username"
                        type="text"
                        placeholder="Type username here"
                        />

                        <InputField 
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="Type password here"
                        />

                        <Button type="submit" isLoading={isSubmitting} colorScheme="teal" width="full">
                        Register
                        </Button>
                    </VStack>
                </Form>
            )}
        </Formik>
        </Wrapper>
    );
}

export default Register;