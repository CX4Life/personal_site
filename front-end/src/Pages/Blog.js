import React from 'react';
import styled from 'styled-components';
import { Header, Post, OneColumn } from '../Parts';

const Offset = styled.div`
    padding-top: 120px;
`;

const Content = ({ children }) => (
    <Offset>
        <OneColumn>
            {children}
        </OneColumn>
    </Offset>
);

export class Blog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            posts: []
        };
    }

    componentDidMount() {
        if (!this.props.api) {
            return;
        }
        this.props.api.get('/posts')
            .then(({ data }) => {
                this.setState({
                    posts: data.sort((a, b) => new Date(a.created_on) - new Date(b.created_on))
                });
            });
    }

    render() {
        return (
            <div className='app'>
                <Header />
                <Content>
                    {this.state.posts.map((post, idx) => (
                        <Post
                            {...post}
                            key={`post-${idx}`}
                        />
                    ))}
                </Content>
            </div>
        )
    }
}
