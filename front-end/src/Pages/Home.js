import React from 'react';
import styled from 'styled-components';
import { Header, Background } from '../Parts';

const Centered = styled.div`
    display: flex;
    justify-content: space-between;
`;

const Subtitle = styled.h3`
    font-weight: 300;
`;

const InternalLink = styled.button`
    height: 12.0rem;
    text-align: left;
    font-family: 'Helvetica';
    width: 35vw;
    min-width: 180px;
    font-weight: bolder;
    font-size: 60px;
    background-color: rgba(225, 252, 252, 0.8);
    cursor: pointer;
    box-shadow: 6px 6px 10px -2px rgba(0,0,0,0.75);
`;

export const Home = () => (
    <div>
        <Header />
        <Background
            content={(
                <div>
                    <h1>Hi, I'm Tim.</h1>
                    <Subtitle>I'm a Full-Stack Software Engineer</Subtitle>
                    <Centered>
                        <InternalLink href="/about">About Me</InternalLink>
                        <div style={{ minWidth: '2.0rem' }} />
                        <InternalLink href="/posts">Blog</InternalLink>
                    </Centered>
                </div>
            )}
        />
    </div>
);
