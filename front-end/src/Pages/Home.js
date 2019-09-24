import React from 'react';
import styled from 'styled-components';
import { Header, Background } from '../Parts';

const Centered = styled.div`
    color: white;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const Subtitle = styled.h3`
    font-weight: 300;
`;


export const Home = () => (
    <div>
        <Header />
        <Background
            content={(
                <div style={{ color: 'white' }}>
                    <h1>Hi, I'm Tim.</h1>
                    <Subtitle>I'm a Full-Stack Software Engineer</Subtitle>
                    {/* <Centered>
                        <div href="/about">About Me</div>
                        <div style={{ minWidth: '2.0rem' }} />
                        <div href="/posts">Blog</div>
                    </Centered> */}
                </div>
            )}
        />
    </div>
);
