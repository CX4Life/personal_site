import React from 'react';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import Moment from 'moment';

const StyledPost = styled.div`
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 2px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    font-family: 'PT Sans', sans-serif;
    margin-block-end: 2rem;
`;

const PostHeader = styled.div`
    padding-top: 1rem;
    padding-left: 1rem;
    color: white;
    background-color: #111;
`

const PostTitle = styled.span`
    font-size: xx-large;
    border-bottom: white;
    border-bottom-style: solid;
    border-width: 2px;
    padding: 0.3rem;
`;

const PostDate = styled.h3`
    font-variant: all-petite-caps;
`;

const PostContent = styled.div`
    padding: 1rem;
`;

const Post = ({ title, created_on, contents }) => {
    const formattedDate = Moment(new Date(created_on)).format('MMMM Do, YYYY');

    return (
        <StyledPost>
            <PostHeader>
                <PostTitle>{title}</PostTitle>
                <PostDate>{formattedDate}</PostDate>
            </PostHeader>
            <PostContent>
                <ReactMarkdown style={{ fontFamily: 'PT Sans' }} source={contents} />
            </PostContent>
        </StyledPost>
    );
};

export default Post;
