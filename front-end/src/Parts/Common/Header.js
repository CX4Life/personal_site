import React from 'react';
import styled from 'styled-components';
import { Github, LinkedIn } from '../../Icons';

const LIVING_CORAL = '#FC267A';

const FixedHeader = styled.div`
    z-index: 10003;
    height: ${props => props.height || '70px'};
    background-color: #222;
    display: flex;
    position: fixed;
    top: 0;
    flex-direction: column;
    align-items: space-between;
    padding-top: 0.3rem;
    padding-left: 8vw;
    padding-right: 8vw;
`;

const Title = styled.div`
    min-width: 180px;
`;

const FirstName = styled.span`
    font-weight: 800;
    font-size: 30px;
    color: ${LIVING_CORAL};
    letter-spacing: 0.2rem;
    margin-left: 0.4rem;
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
    padding-top: 4px;
`;

const IconLink = styled.div`
    text-decoration: none;
    fill: #2ADAD5;
    padding: 0.5em;
    cursor: pointer;
    height: 24px;
    width: 24px;
`;

const HeaderRow = styled.div`
    display: flex;
    width: 84vw;
    flex-direction: row;
    justify-content: space-between;
`;

const SiteLinkWrapper = styled.div`
    display: flex;
    flex-direction: row;
    flex-basis: 80px;
    justify-content: flex-start;
    margin-left: 0.4rem;
    padding-top: 0.5rem;
`;

const SiteLink = styled.span`
    color: ${LIVING_CORAL}
    padding-right: 2.0rem;
    font-size: 14px;
    font-weight: 400;
    font-family: 'Open Sans';
    cursor: pointer;
`;

const TitleName = () => (
    <Title>
        <FirstName>TIM</FirstName>
        <LastName>WOODS</LastName>
    </Title>
);

const SocialLinks = ({ links }) => {
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

const SiteLinks = ({ links }) => {
    return (
        <SiteLinkWrapper>
            {links.map(link =>
                <SiteLink
                    key={`${link.name}-link`}
                    onClick={() => window.location.href = link.href}
                >
                    {link.name}
                </SiteLink>
            )}
        </SiteLinkWrapper>
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

    const siteLinks = [
        {
            name: 'HOME',
            href: '/'
        },
        {
            name: 'BLOG',
            href: '/blog'
        }
    ];

    return (
        <FixedHeader
            height='80px'>
            <HeaderRow>
                <TitleName />
                <SocialLinks links={socialLinks} />
            </HeaderRow>
            <span style={{ borderBlockEnd: '1px', borderBlockEndStyle: 'solid', borderBlockEndColor: 'grey' }}></span>
            <HeaderRow style={{ alignItems: 'center' }}>
                <SiteLinks links={siteLinks} />

            </HeaderRow>
        </FixedHeader>
    );
}
