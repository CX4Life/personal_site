import React from 'react';
import styled from 'styled-components';

const Transparent = styled.div`
    display: flex;
    flex-direction: column;
    background-color: rgba(255, 255, 255, 0.85);
    padding-left: 8vw;
    padding-right: 8vw;
`;

const OneColumn = ({ children }) => (
    <Transparent>
        {children}
    </Transparent>
);

export default OneColumn;
