import React from 'react';
import styled from 'styled-components';

const FixedHeader = styled.div`
    z-index: 10003;
    width: 100%;
    height: 10vh;
    background-color: #222;
    display: flex;
    position: fixed;
    top: 0;
    flex-direction: row;
    align-items: center;
    font-family: 'Source Sans Pro', sans-serif;
`;

const Title = styled.div`
    margin: 0.3em;
    margin-left: 120px;
    padding-right: 30px;
    width: 40%;
    min-width: 180px;
`;

const FirstName = styled.span`
    font-weight: bolder;
    font-size: 30px;
    color: #FC267A;
    letter-spacing: 0.3rem;
`;

const LastName = styled.span`
    font-weight: normal;
    font-size: 30px;
    color: #CA0038;
    margin-left: 0.8rem;
    letter-spacing: 0.2rem;
`

const StyledLinks = styled.div`
    font-size: 16px;
    display: flex;
    width: 60%;
    margin-right: 120px;
    justify-content: flex-end;
`;

const Link = styled.a`
    text-decoration: none;
    color: #2ADAD5;
    padding: 0.5em;
`;

const TitleName = () => (
    <Title>
        <FirstName>TIM</FirstName>
        <LastName>WOODS</LastName>
    </Title>
);

const Links = ({ links }) => (
    <StyledLinks>
        {links.map(
            link => <Link key={`${link.name}-link`} href={link.href}>{link.name}</Link>
        )}
    </StyledLinks>
);

export const Header = () => {
    const socialLinks = [
        {
            name: 'GitHub',
            href: 'https://www.github.com/cx4life'
        },
        {
            name: 'LinkedIn',
            href: 'https://www.linkedin.com/in/tim--woods'
        }
    ];

    return (
        <FixedHeader>
            <TitleName />
            <Links links={socialLinks} />
        </FixedHeader>
    );
}
