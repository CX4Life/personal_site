import React, { Component } from 'react';
import styled from 'styled-components';

const StyledPost = styled.div`
    margin-block-start: 1em;
    color: #333;
`;

export default class Posts extends Component {
    state = {
        body: 'This is the personal site of Tim Woods.'
    };

    render() {
        return (
            <StyledPost>{this.state.body}</StyledPost>
        );
    }
}