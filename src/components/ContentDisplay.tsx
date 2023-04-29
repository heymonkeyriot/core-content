import React from 'react';

interface ContentDisplayProps {
  promptText: string;
  descriptionString: string;
  processedFileContent: string;
  onCopy: () => void;
  copyButtonText: string;
}

const ContentDisplay: React.FC<ContentDisplayProps> = ({
  promptText,
  descriptionString,
  processedFileContent,
  onCopy,
  copyButtonText,
}) => {
  return (
    <div className="w-full h-96 border border-teal p-2 mb-4 relative">
      <div className="h-full overflow-scroll">
        {promptText && <p className="bg-accent-900 text-white p-2">{promptText}</p>}
        {descriptionString && (
          <p className="bg-accent-900 mt-2 mb-2 text-white p-2">{descriptionString}</p>
        )}

        {processedFileContent && (
          <div>
            <pre className="whitespace-pre-wrap overflow-x-auto text-xs p-2">{processedFileContent}</pre>
          </div>
        )}
      </div>
      <button
        onClick={onCopy}
        className="absolute bottom-2 right-2 hover:bg-teal hover:text-darkBlue border border-teal font-bold py-2 px-4"
      >
        {copyButtonText}
      </button>
    </div>
  );
};

export default ContentDisplay;
