import React, { useState } from 'react';
import ModelSelectionRadio from './ModelSelectionRadio';

interface ModelSelectionProps {
    onModelChange: (newTokenLimitValue: number) => void;
}



const ModelSelection: React.FC<ModelSelectionProps> = ({ onModelChange }) => {

    return (
        <div className="mb-3 border-b border-teal pb-3">
            <h3 className="text-lg tracking-wide">
                Model being used?</h3>
            <ModelSelectionRadio onModelChange={onModelChange} />
        </div>
    );
};

export default ModelSelection;
