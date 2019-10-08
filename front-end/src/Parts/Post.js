import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import Expanding from './Expanding';
import styled from 'styled-components';

const StyledPost = styled.div`
    background: #fff;
    border-radius: 2px;
    padding: 1rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
`;

const Post = ({ title, created_on, contents }) => (
    <StyledPost>
        <Expanding
            fixed={<div>
                <h2>{title}</h2>
                <span>{created_on}</span>
            </div>}
            expanding={<ReactMarkdown source={contents} />}
        />
    </StyledPost>
);

export default Post;
