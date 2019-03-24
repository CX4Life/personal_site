import React, { Component } from 'react';
import { Welcome, Posts } from '.';
import styled from 'styled-components';

const Wrapper = styled.div`
    font-family: 'Roboto Condensed', sans-serif;
    margin-left: 120px;
    margin-right: 120px;
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