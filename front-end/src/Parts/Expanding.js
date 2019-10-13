import React from 'react';
import AnimateHeight from 'react-animate-height';

const Header = ({ content, onClick }) => {
    return <div onClick={onClick}>
        {content}
    </div>
};

const Children = ({ content, height }) => (
    <AnimateHeight duration={400} height={height}>
        {content}
    </AnimateHeight>
);

export default class Expanding extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            height: 0
        }

        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        const { height } = this.state;
        this.setState({
            height: (height === 0 ? 'auto' : 0)
        });
    }

    render() {
        const { height } = this.state;

        return (
            <div>
                <Header content={this.props.fixed} onClick={this.toggle} />
                <Children content={this.props.expanding} height={height} />
            </div>
        );
    }
}
