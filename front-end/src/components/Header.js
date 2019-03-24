import React, { Component } from 'react';
import styled from 'styled-components';

const StyledHeader = styled.div`
    width: 100%;
    background-color: #FA7268;
    display: flex;
    flex-direction: row;
    align-items: baseline;
    position: fixed;
    font-family: 'Source Sans Pro', sans-serif;
`;

const StyledTitle = styled.div`
    font-weight: 600;
    margin: 0.5em;
    font-size: 30px;
    width: 40%;
    min-width: 180px;
`;

const StyledLinks = styled.div`
    font-size: 16px;
    display: flex;
    flex-direction: row-reverse;
`;

const Link = styled.a`
    /* ... */
`;

export default class Header extends Component {
    state = {
        title: 'Tim Woods',
        tabs: [{
            name: 'GitHub',
            link: 'https://www.github.com/cx4life'
        },
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