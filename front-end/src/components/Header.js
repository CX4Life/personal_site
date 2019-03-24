import React, { Component } from 'react';
import styled from 'styled-components';

const StyledHeader = styled.div`
    width: 100%;
    background-color: #FA7268;
    display: flex;
    flex-direction: row;
    align-items: baseline;
    font-family: 'Source Sans Pro', sans-serif;
`;

const StyledTitle = styled.div`
    font-weight: 600;
    margin: 0.3em;
    margin-left: 120px;
    font-size: 30px;
    width: 40%;
    min-width: 180px;
`;

const StyledLinks = styled.div`
    font-size: 16px;
    display: flex;
    width: 60%;
    margin-right: 120px;
    justify-content: flex-end;
`;

const Link = styled.a`
    text-decoration: none;
    color: #333;
    padding: 0.5em;
`;

export default class Header extends Component {
    state = {
        title: 'Tim Woods',
        tabs: [
            {
                name: 'GitHub',
                link: 'https://www.github.com/cx4life'
            },
            {
                name: 'LinkedIn',
                link: 'https://www.linkedin.com/in/tim--woods'
            }
        ],
    };

    buildTabs = () => {
        let key = 0;
        return (
            <StyledLinks>
                {this.state.tabs.map(tab =>
                    (<Link key={`tab-${key++}`} href={tab.link}>{tab.name}</Link>)
                )}
            </StyledLinks>
        )
    }

    render() {
        return (
            <div className='header'>
                <StyledHeader>
                    <StyledTitle>{this.state.title}</StyledTitle>
                    {this.buildTabs()}
                </StyledHeader>
            </div>
        );
    }
}