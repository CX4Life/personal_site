import React from 'react';
import { Header, Post } from '../Parts';

export class Blog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            posts: [],
        };
    }

    componentDidMount() {
        if (!this.props.api) {
            return;
        }
        this.props.api.get('/posts')
            .then(({ data }) => {
                this.setState({
                    posts: data
                });
            });
    }

    render() {
        return (
            <div className='app'>
                <Header />
                <div>
                    {this.state.posts.map((post, idx) => (
                        <Post
                            {...post}
                            key={`post-${idx}`}
                        />
                    ))}
                </div>
            </div>
        )
    }
}
