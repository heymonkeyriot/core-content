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
    <div className="w-full h-96 border border-black p-2 bg-gray-200 mb-4 relative">
      <div className="h-full overflow-scroll">
        {promptText && <p className="bg-gray-900 text-white p-2">{promptText}</p>}
        {descriptionString && (
          <p className="bg-gray-900 mt-2 mb-2 text-white p-2">{descriptionString}</p>
        )}

        {processedFileContent && (
          <div>
            <pre className="whitespace-pre-wrap overflow-x-auto text-xs p-2">{processedFileContent}</pre>
          </div>
        )}
      </div>
      <button
        onClick={onCopy}
        className="absolute bottom-2 right-2 bg-white hover:bg-black hover:text-white text-black border border-black font-bold py-2 px-4"
      >
        {copyButtonText}
      </button>
    </div>
  );
};

export default ContentDisplay;
