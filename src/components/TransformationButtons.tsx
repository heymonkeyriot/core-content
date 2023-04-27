import React from 'react';

interface Transformation {
  name: string;
  isActive: boolean;
}

interface TransformationButtonsProps {
  transformations: Transformation[];
  onTransformationClick: (index: number) => void;
}

const TransformationButtons: React.FC<TransformationButtonsProps> = ({
  transformations,
  onTransformationClick,
}) => {
  return (
    <div className="grid grid-cols-4 gap-2">
      {transformations.map((transformation, index) => (
        <button
          className={`text-center p-2 border ${
            transformation.isActive ? 'bg-black text-white border-black' : 'border-black'
          }`}
          key={index}
          onClick={() => onTransformationClick(index)}
        >
          {transformation.name}
        </button>
      ))}
    </div>
  );
};

export default TransformationButtons;
