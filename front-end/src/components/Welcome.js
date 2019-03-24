import React, { Component } from 'react';
import styled from 'styled-components';

const lightTextColor = 'color: #333;';

const StyledWelcome = styled.div`
    font-family: 'Roboto Condensed', sans-serif;
    margin-block-start: 3em;
`;

const StyledTitle = styled.h2`
    /* ... */
`;

const StyledSubtitle = styled.h4`
    ${lightTextColor}
`;

const StyledSplash = styled.p`
    ${lightTextColor}
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
                <StyledSubtitle>
                    {this.props.welcomeSubtitle || this.state.defaultSubtitle}
                </StyledSubtitle>
                <StyledSplash>
                    {this.props.welcomeSplash || this.state.defaultSplash}
                </StyledSplash>
            </StyledWelcome>
        );
    }
}