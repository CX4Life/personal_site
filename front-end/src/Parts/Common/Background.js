import React from 'react';
import styled from 'styled-components';

const StyledBackground = styled.div`
    position: relative;
    top: 4.0rem;
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
    height: -webkit-fill-available;
    padding-top: 2.0rem;
    margin-left: 100px;
    margin-right: 100px;
    padding-left: 60px;
    padding-right: 60px;
    background-color: rgba(255, 255, 255, 0.8);
`;

export const Background = ({ content }) => (
    <StyledBackground>
        <Content>{content}</Content>
    </StyledBackground>
);
