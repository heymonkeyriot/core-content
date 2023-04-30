// TransformationButtons.tsx
import React from 'react';
import { useState } from 'react'
import Image from 'next/image';
import clsx from 'clsx';

interface Transformation {
  name: string;
  isActive: boolean;
  reduceTokens: boolean;
  img: {
    active: string;
    inactive: string;
  };
}

interface TransformationButtonsProps {
  transformations: Transformation[];
  onFirstLoad: boolean;
  onTransformationClick: (index: number) => void;
}

const TransformationButtons: React.FC<TransformationButtonsProps> = ({
  transformations,
  onFirstLoad,
  onTransformationClick,
}) => {
  const sortedTransformations = transformations.sort((a, b) => {
    return a.reduceTokens === b.reduceTokens ? 0 : a.reduceTokens ? -1 : 1;
  });

  return (
    <div className="transformations grid grid-flow-col grid-rows-2 gap-4">
      {sortedTransformations.map((transformation, index) => (

        <button
          className={`text-center border p-1 ${transformation.isActive
              ? 'bg-teal text-darkBlue border-teal'
              : 'border-teal'
            }`}
          key={index}
          onClick={() => onFirstLoad ? null : onTransformationClick(index)}
        >
          <span className="tooltip">{transformation.name}</span>
          <Image
            src={
              transformation.isActive
                ? "/" + transformation.img.active
                : "/" + transformation.img.inactive
            }
            width={124}
            height={10}
            alt={transformation.name}
          />
        </button>

      ))}
    </div>
  );
};

export default TransformationButtons;
