import React from 'react';
import styled from 'styled-components';

export const SHADOW_TYPES = {
    small: '3px 3px 5px -1px black',
    large: '6px 6px 10px -2px black'
};

export const CARD_PADDING = {
    small: `
        padding-top: 0.1rem;
        padding-left: 1.0rem;
        padding-right: 1.0rem;
        padding-bottom: 1.0rem;
    `,
    large: `
        padding-top: 2.0rem;
        padding-left: 40px;
        padding-right: 40px;
        padding-bottom: 3.0rem;
    `,
}

const FloatingDiv = styled.div`
    background-color: rgba(255, 250, 250, ${props => props.opacity || '1'});
    box-shadow: ${props => props.box || SHADOW_TYPES.small};
    ${props => props.padding || ''}
`;

export const Card = props => {
    const { content, opacity, box, padding } = props;
    return (
        <FloatingDiv box={box} opacity={opacity} padding={padding}>
            {content}
        </FloatingDiv>
    );
}