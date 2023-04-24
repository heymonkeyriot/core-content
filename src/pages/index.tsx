import Image from 'next/image'
import { useState, useRef, useEffect, useCallback } from 'react';
import { Inter } from 'next/font/google'
import useFileReader from '../pages/api/upload';
import TokenMessage from '../components/TokenMessage';
import ModelSelectionRadio from '../components/ModelSelectionRadio';
import { transformations } from '../utils/calcs'
import { GPT4_TOKEN_LIMIT } from '../utils/counts';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [copyButtonText, setCopyButtonText] = useState('Copy');
  const { fileContent, processFile } = useFileReader();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [originalFileContent, setOriginalFileContent] = useState("This is the original file content...");
  const [processedFileContent, setProcessedFileContent] = useState(originalFileContent);

  const [tokenLimitValue, setTokenLimitValue] = useState(8000);

  const [promptText, setPromptText] = useState('');
  const handlePromptTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPromptText(event.target.value);
  };

  const applyActiveTransformations = (inputFileContent: string) => {
    let result = inputFileContent;
    console.log("in applyActiveTransformations");
    console.time;
    transformations.forEach((transformation) => {
      if (transformation.isActive) {
        console.log("in transformation.isActive");
        console.time;
        result = transformation.func(result);
        console.log(result);
        console.time;
      }
    });

    console.log(result);

    return result;
  };

  const handleFileUpload = async () => {
    console.log('Starting handleFileUpload');

    if (!fileInputRef.current?.files) {
      alert('Please select a file');
      return;
    }

    const file = fileInputRef.current.files[0];
    if (file) {
      resetTransformations();
      await processFile(file);
    } else {
      console.log('!fileInputRef!.current!.files![0] is null');
    }
  };

  useEffect(() => {
    if (fileContent !== undefined) {
      const transformedContent = applyActiveTransformations(fileContent ?? "This is blank");
      setProcessedFileContent(transformedContent);
    }
  }, [fileContent]);

  function getTokenCount(text: string): number {
    const characterCount = text.length;
    const tokenCount = Math.ceil(characterCount / 4);
    return tokenCount;
  }

  function getTokenCountString(text: string): string {
    var tokenCount = getTokenCount(text);
    return `~ ${tokenCount} tokens`;
  }

  const tokenCount = GPT4_TOKEN_LIMIT; // Example token count value

  const handleModelChange = (newTokenLimitValue: number) => {
    setTokenLimitValue(newTokenLimitValue);
  };

  const copyToClipboard = useCallback(async () => {
    if (processedFileContent) {
      try {
        await navigator.clipboard.writeText(promptText+processedFileContent);
        setCopyButtonText('Copied');
        setTimeout(() => {
          setCopyButtonText('Copy');
        }, 3000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  }, [processedFileContent]);

  const resetTransformations = () => {
    transformations.forEach((transformation) => {
      transformation.isActive = false;
    });
  };


  return (
    <div className="max-w-4xl mx-auto">
      <header className="w-full py-10 text-2xl font-light tracking-widest">
        <h1>Core Content</h1>
      </header>
      <main className="flex space-x-4">
        <div className="w-1/3 col1">
          <div className="mb-3 border-b border-gray-200 pb-3">
            <h3 className="text-lg tracking-wide">
              Select your data</h3>
            <div>
              <h4>File upload</h4>
              <input
                className="w-full border border-black mt-2"
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".doc,.docx,.pdf,.json,.txt"
                disabled={loading}
              />
              <small className='text-xs text-right'>Allowed files: .html, .docx, .txt, .json, .pdf</small>
            </div>
          </div>
          <div className="mb-3 border-b border-gray-200 pb-3">
            <h3 className="text-lg tracking-wide">
              What do you want to know?</h3>
            <textarea
              onChange={handlePromptTextChange}
              value={promptText}
              className="w-full border border-gray-400 focus:border-black focus:border-2 mt-2 text-sm"
              rows={4}
              placeholder='e.g. Summarise the above data into 10 separate bullet-points that can be used within a PowerPoint presentation'
            ></textarea>
          </div>
          <div>
            <h3 className="text-lg tracking-wide">
              Model being used?</h3>
            <ModelSelectionRadio onModelChange={handleModelChange} />
          </div>
        </div>
        <div className="w-2/3 col2 px-4 border-l">
          <div className="w-full h-96 overflow-scroll border border-black p-2 bg-gray-200 mb-4 relative">
            <p className='bg-gray-900 text-white p-2'>{promptText}</p>
            {fileContent && (
              <>
                <div>
                  <pre className="text-xs p-2">{processedFileContent}</pre>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="absolute bottom-2 right-2 bg-white hover:bg-black hover:text-white text-black border border-black font-bold py-2 px-4"
                >
                  {copyButtonText}
                </button>
              </>
            )}
          </div>

          <div className="w-full border border-black p-2 bg-white mb-4">
            <p className="text-right">{getTokenCountString(`${fileContent}${promptText}` ?? "0 tokens")} • <TokenMessage count={getTokenCount(`${fileContent}${promptText}` ?? "")} tokenLimitValue={tokenLimitValue} /></p>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {transformations.map((transformation, index) => (
              <button
                className={`text-center p-2 border ${transformation.isActive ? "bg-black text-white border-black" : "border-black"
                  }`}
                key={index}
                onClick={() => {
                  console.log("transformations.map button clicked");
                  transformation.isActive = !transformation.isActive;
                  const transformedContent = applyActiveTransformations(fileContent ?? "");
                  setProcessedFileContent(transformedContent);
                }}
              >
                {transformation.name}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
