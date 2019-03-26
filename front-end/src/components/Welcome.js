import React, { Component } from 'react';
import styled from 'styled-components';

const lightTextColor = 'color: #333;';

const StyledWelcome = styled.div`
    font-family: 'Roboto Condensed', sans-serif;
    margin-block-start: 3em;
    border-bottom: 2px solid #0abab5;
`;

const StyledTitle = styled.h2`
    /* ... */
`;

const StyledSplash = styled.p`
    ${lightTextColor}
    margin-block-end: 2em;
`;

export default class Welcome extends Component {
    state = {
        defaultTitle: 'Welcome to Tim Woods Personal Site',
        defaultSubtitle: 'Thanks for taking a peek at my site.',
        defaultSplash: `This is a personal project that utilizes React with Styled Components,
            hosted on a DO droplet using NGINX and Docker. I'm using it to play with technology,
            explore coordinating microservices, and eventually present projects and blog posts.`
    }

    render() {
        return (
            <StyledWelcome>
                <StyledTitle>
                    {this.props.welcomeTitle || this.state.defaultTitle}
                </StyledTitle>
                <StyledSplash>
                    {this.props.welcomeSplash || this.state.defaultSplash}
                </StyledSplash>
            </StyledWelcome>
        );
    }
}