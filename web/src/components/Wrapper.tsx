import { Box, Flex } from '@chakra-ui/react';
import React from 'react'

interface WrapperProps {
    children: React.ReactNode,
    variant?: "small" | "regular",
}

const Wrapper: React.FC<WrapperProps> = ({ children, variant = "regular" }: any) => {
        return (
            // <Box>{ children }</Box>
            <Box mt={8} mx={"auto"} maxW={variant === "regular" ? "800px" : "400px"} w={"100%"}>
                {children}
            </Box>
        );
}

export default Wrapper;