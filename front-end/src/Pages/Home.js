import React from 'react';
import styled from 'styled-components';
import { Header, ImageURLs, Background, Page, OneColumn } from '../Parts';


const Centered = styled.div`
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    height: 100%;
`;

const Title = styled.h1`
    font-family: 'PT Sans', sans-serif;
    flex-grow: 1;
    flex-basis: 1rem;
    font-size: 60px;
    letter-spacing: 0.15rem;
`;

const SubTitle = styled.h2`
    font-family: 'PT Sans', sans-serif;
    font-size: 30px;
    margin-block-end: 0.3rem;
`;

const Bar = styled.span`
    width: 100%;
    border-style: solid;
    border-width: thin;
    border-color: #333
`;

const Offset = styled.div`
    flex-grow: 3;
    flex-basis: 1rem;
`;

const Text = styled.div`
    padding-top: 1rem;
    padding-bottom: 2rem;
    flex-grow: 1;
    font-size: 14px;
    font-family: 'Open Sans';
    color: #222;
`;

const FirstPane = () => (
    <Background image={ImageURLs.bg1}>
        <Centered>
            <Offset />
            <Title>Hi, I'm Tim</Title>
        </Centered>
    </Background>
);

const SecondPane = () => (
    <Background image={ImageURLs.bg2}>
        <OneColumn>
            <SubTitle>About Me</SubTitle>
            <Bar />
            <Text>
                <p>I'm a full-stack Software Engineer in Bellingham, Washington.</p>
                <p>
                    I write PHP, Node, C#, SQL and React at work. I've made and maintained
                    internal and public REST APIs, event-driven microservices in Azure,
                    complex UIs with React and Redux, and all the goo in-between.
                    </p>
                <p>
                    I enjoy learning with my colleagues as we modernize our SaaS webiste, and
                    by playing with technology in personal projects, like this site.
                    </p>
                <p>
                    I'm excited to share my thoughts here as I continue learn more about
                    Software Development.
                    </p>
            </Text>
        </OneColumn>
    </Background >
);

export const Home = () => (
    <Page>
        <Header />
        <FirstPane />
        <SecondPane />
    </Page>
);
