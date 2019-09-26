import React from 'react';
import styled from 'styled-components';

const StyledBackground = styled.div`
    background-image: url("${props => props.url}");
    background-attachment: fixed;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    height: 100%;
    width: 100%;
`;

const Slide = styled.div`
    height: 100vh;
`;

export const Background = ({ image, children }) => (
    <StyledBackground url={image}>
        <Slide>{children}</Slide>
    </StyledBackground>
);
