import React from 'react';
import { StyledSpinnerContainer } from '../../../../Scripts/src/styles/index.js';

const SpinnerContainer = () => (
    <StyledSpinnerContainer>
        <div className="loader"></div>
        <span>Loading...</span>
    </StyledSpinnerContainer>
)
export default SpinnerContainer;