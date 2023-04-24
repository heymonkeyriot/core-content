import Image from 'next/image'
import { useState, useRef, useCallback } from 'react';
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

  const applyActiveTransformations = () => {
    let result = originalFileContent;

    transformations.forEach((transformation) => {
      if (transformation.isActive) {
        result = transformation.func(result);
      }
    });

    setProcessedFileContent(result);
  };

  const handleFileUpload = async () => {
    console.log('Starting handleFileUpload');

    if (!fileInputRef.current?.files) {
      alert('Please select a file');
      return;
    }

    const file = fileInputRef.current.files[0];
    if (file) {
      await processFile(file);
    } else {
      console.log('!fileInputRef!.current!.files![0] is null');
    }
  };

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
    if (fileContent) {
      try {
        await navigator.clipboard.writeText(fileContent);
        setCopyButtonText('Copied');
        setTimeout(() => {
          setCopyButtonText('Copy');
        }, 3000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  }, [fileContent]);


  return (
    <div className="max-w-4xl mx-auto">
      <header className="w-full py-10 text-2xl font-light tracking-widest">
        <h1>No vector prompt generator</h1>
      </header>
      <main className="flex space-x-4">
        <div className="w-1/3 col1">
          <div className="mb-3 border-b border-gray-200 pb-3">
            <h3 className="text-lg tracking-wide">
              Select your data</h3>
            {/* <div className="mb-2">
              <h4>URL</h4>
              <div className="flex items-center">
                <input
                  className="border border-gray-400 focus:border-black focus:border-2 w-full"
                  type="text"
                />
                <button className="border px-4 py-2 border-gray-400">Get</button>
              </div>
            </div> */}
            <div>
              <h4>File upload</h4>
              {/* <input type="file" ref={fileInputRef} /> */}
              <input
                className="w-full border border-black mt-2"
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".doc,.docx,.pdf,.json,.txt"
                disabled={loading}
              />
              {/* <button className="w-full border border-black mt-2" onClick={handleFileUpload} disabled={loading}>
                {loading ? 'Uploading...' : 'Upload document'}
              </button> */}
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
            {/* <div className="flex items-center mt-2">
              <span>sanitise</span>
              <input className="ml-2" type="checkbox" />
            </div> */}
          </div>
        </div>
        <div className="w-2/3 col2 px-4 border-l">
          <div className="w-full h-96 overflow-scroll border border-black p-2 bg-gray-200 mb-4 relative">
          <p className='bg-gray-900 text-white p-2'>{promptText}</p>
            {fileContent && (
              <>
                <div>
                  <pre className="text-xs p-2">{fileContent}</pre>
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
              <button className="text-center p-2 border border-black"
                key={index}
                onClick={() => {
                  transformation.isActive = !transformation.isActive;
                  applyActiveTransformations();
                }}
              >
                {transformation.name}
              </button>
            ))}
            {/* {Array(8)
              .fill(null)
              .map((_, i) => (
                <div
                  key={i}
                  className="text-center p-2 border border-black"
                >
                  Change
                </div>
              ))} */}
          </div>
        </div>
      </main>
    </div>
  );
}
