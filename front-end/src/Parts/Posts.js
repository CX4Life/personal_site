import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';

const StyledPost = styled.div`
    background: #fff;
    border-radius: 2px;
    padding: 1rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
`;

export default class Posts extends Component {
    constructor(props) {
        super(props);

        this.state = {
            post: this.props.post
        }
    }

    render() {
        return (
            <StyledPost>
                <ReactMarkdown source={this.state.post} />
            </StyledPost>
        );
    }
}