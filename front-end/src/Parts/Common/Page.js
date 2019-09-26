import React from 'react';
import styled from 'styled-components';

const Flex = styled.div`
    display: flex;
    flex-direction: column;
`;

export const Page = props => (
    <Flex>{props.children}</Flex>
);
