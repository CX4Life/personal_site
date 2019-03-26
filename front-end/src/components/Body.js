import React, { Component } from 'react';
import { Welcome, Posts } from '.';
import styled from 'styled-components';

const Wrapper = styled.div`
    font-family: 'Roboto Condensed', sans-serif;
    margin-left: 60px;
    margin-right: 60px;
`;

export default class Body extends Component {
    render() {
        return (
            <Wrapper>
                <Welcome welcomeTitle="Hi."></Welcome>
                {/* <Posts></Posts> */}
            </Wrapper>
        )
    }
}