import React from 'react';
import styled from 'styled-components';
const lightTextColor = 'color: #333;';

const StyledWelcome = styled.div`
    font-family: 'PT Sans', sans-serif;
    margin-block-start: 2em;
    margin-block-end: 2em;
    margin: 120px;
    border-bottom: 2px solid #0abab5;
`;

const StyledSplash = styled.p`
    ${lightTextColor}
    margin-block-end: 2em;
`;

const Welcome = () => {
    const headerText = 'Hi';
    const welcomeText = `This is a personal project that utilizes React with Styled Components,
        hosted on a DO droplet using NGINX and Docker. I'm using it to play with technology,
        explore coordinating microservices, and eventually present projects and blog posts.`
    return (
        <div>
            <StyledWelcome>
                <h2>{headerText}</h2>
                <StyledSplash>{welcomeText}</StyledSplash>
            </StyledWelcome>
        </div>
    );
};

export default Welcome;
