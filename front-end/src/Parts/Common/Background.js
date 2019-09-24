import React from 'react';
import styled from 'styled-components';

const StyledBackground = styled.div`
    position: relative;
    top: 1.0rem;
    background-image: url("/background.jpg");
    background-size: 100vw;
    background-color: #042A3C;
    background-repeat: no-repeat;
    width: 100%;
    height: 90vh;
    opacity: 30%;
`;

const Content = styled.div`
    font-family: 'PT Sans';
    position: relative;
    top: 6.0rem;
    padding-top: 2.0rem;
    margin-left: 80px;
    margin-right: 80px;
    padding-left: 40px;
    padding-right: 40px;
    padding-bottom: 3.0rem;
    background-color: rgba(34, 34, 34, 0.7);
`;

export const Background = ({ content }) => (
    <StyledBackground>
        <Content>{content}</Content>
    </StyledBackground>
);
