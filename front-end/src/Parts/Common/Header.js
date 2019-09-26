import React from 'react';
import styled from 'styled-components';
import { Github, LinkedIn } from '../../Icons';

const LIVING_CORAL = '#FC267A';

const FixedHeader = styled.div`
    z-index: 10003;
    width: 100%;
    height: 70px;
    background-color: #222;
    display: flex;
    position: fixed;
    top: 0;
    flex-direction: row;
    align-items: center;
`;

const Title = styled.div`
    margin: 0.3em;
    margin-left: 10vw;
    padding-right: 2vm;
    width: 40%;
    min-width: 180px;
`;

const FirstName = styled.span`
    font-weight: 800;
    font-size: 30px;
    color: ${LIVING_CORAL};
    letter-spacing: 0.2rem;
    font-family: 'Open Sans';
`;

const LastName = styled.span`
    font-weight: 400;
    font-size: 30px;
    color: ${LIVING_CORAL};
    margin-left: 0.8rem;
    letter-spacing: 0.3rem;
    font-family: 'Open Sans';
`;

const StyledLinks = styled.div`
    display: flex;
    width: 60%;
    margin-right: 8vw;
    justify-content: flex-end;
`;

const IconLink = styled.div`
    text-decoration: none;
    fill: #2ADAD5;
    padding: 0.5em;
    cursor: pointer;
    height: 24px;
    width: 24px;
`;

const TitleName = () => (
    <Title>
        <FirstName>TIM</FirstName>
        <LastName>WOODS</LastName>
    </Title>
);

const Links = ({ links }) => {
    const iconMap = {
        'GitHub': <Github />,
        'LinkedIn': <LinkedIn />
    };

    return (
        <StyledLinks>
            {links.map(
                link => (
                    <IconLink
                        key={`${link.name}-link`}
                        onClick={() => window.location.href = link.href}
                    >
                        {iconMap[link.name]}
                    </IconLink>
                ))}
        </StyledLinks>
    );
};

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
