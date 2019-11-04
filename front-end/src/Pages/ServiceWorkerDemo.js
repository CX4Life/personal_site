import React from 'react';
import styled from 'styled-components';
import { Header, OneColumn, Page } from '../Parts';

const Offset = styled.div`
    padding-top: 120px;
`;

const ServiceWorkerDemo = () => {
    return (
        <Page>
            <Header />
            <OneColumn
                children={
                    <Offset>
                        <button>Increment</button>

                    </Offset>
                }
            />
        </Page>
    );
};

export default ServiceWorkerDemo;
