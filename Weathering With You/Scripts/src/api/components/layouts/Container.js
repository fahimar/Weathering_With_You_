import React from 'react';
import { StyledContainer } from '../../../../Scripts/src/styles/index.js';

const Container = ({ children }) => (
    <StyledContainer>
        {children}
    </StyledContainer>
);

export default Container;