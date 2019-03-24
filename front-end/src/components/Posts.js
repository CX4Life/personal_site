import React, { Component } from 'react';

class Posts extends Component {
    state = {
        body: 'This is the personal site of Tim Woods.'
    };

    render() {
        return (
            <div className='posts'>
                {this.state.body}
            </div>
        );
    }
}

export default Posts;