import React from 'react';

interface ContentDisplayProps {
  promptText: string;
  descriptionString: string;
  processedFileContent: string;
  onFirstLoad: boolean;
  onCopy: () => void;
  copyButtonText: string;
}

const ContentDisplay: React.FC<ContentDisplayProps> = ({
  promptText,
  descriptionString,
  processedFileContent,
  onFirstLoad,
  onCopy,
  copyButtonText,
}) => {
  return (
    <div className="w-full h-96 border border-teal p-2 mb-4 relative">
      <div className="h-full overflow-scroll">
        <div className='bg-darkBlue pb-1 top-0 sticky'>
          {promptText && (
            <p className="bg-teal text-darkBlue p-2">{promptText}</p>
          )}
          {descriptionString && (
            <p
              className="bg-teal mt-0 mb-2 text-darkBlue p-2"
              style={{ marginTop: promptText ? '0.5rem' : '0' }}
            >
              {descriptionString}
            </p>
          )}
        </div>
        {processedFileContent && (
          <div>
            <pre
              className={
                (onFirstLoad === false
                  ? 'whitespace-pre-wrap overflow-x-auto text-xs p-2'
                  : 'whitespace-pre-wrap overflow-x-auto text-base leading-relaxed p-2')
              }
            >
              {processedFileContent}
            </pre>
          </div>
        )}
      </div>
      <button
        onClick={onCopy}
        className="absolute bottom-2 right-2 bg-darkBlue hover:bg-teal hover:text-darkBlue border border-teal font-bold py-2 px-4"
      >
        {copyButtonText}
      </button>
    </div>

  );
};

export default ContentDisplay;
