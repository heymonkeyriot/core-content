import { useState, useRef, useEffect, useCallback } from 'react';
import { Inter } from 'next/font/google'
import useFileReader from '../utils/upload';
import { transformations, generateDescription } from '../utils/calcs'
import { GPT4_TOKEN_LIMIT } from '../utils/counts';
import FileUpload from '@/components/FileUpload';
import PromptInput from '@/components/PromptInput';
import ModelSelection from '@/components/ModelSelection';
import ContentDisplay from '@/components/ContentDisplay';
import TokenInfo from '@/components/TokenInfo';
import TransformationButtons from '@/components/TransformationButtons';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [copyButtonText, setCopyButtonText] = useState('Copy');
  const { fileContent, processFile } = useFileReader();
  const [descriptionString, setDescriptionString] = useState('');
  const [originalFileContent, setOriginalFileContent] = useState("This is the original file content...");
  const [processedFileContent, setProcessedFileContent] = useState(originalFileContent);
  const [promptText, setPromptText] = useState('');

  const applyActiveTransformations = (inputFileContent: string) => {
    let result = inputFileContent;
    console.time;
    transformations.forEach((transformation) => {
      if (transformation.isActive) {
        console.time;
        result = transformation.func(result);
        console.log(result);
        console.time;
      }
    });

    setDescriptionString(generateDescription(transformations));

    return result;
  };

  const handleFileUpload = async (file: File) => {
    console.log('Starting handleFileUpload');
    console.log(file)

    if (!file) {
      alert('Please select a file (handleFileUpload');
      return;
    }

    // const file = fileInputRef.current.files[0];
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

  const copyToClipboard = useCallback(async () => {
    if (processedFileContent) {
      try {
        await navigator.clipboard.writeText(promptText + '\n' + descriptionString + '\n' + processedFileContent);
        setCopyButtonText('Copied');
        setTimeout(() => {
          setCopyButtonText('Copy');
        }, 3000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  }, [processedFileContent, promptText]);

  const resetTransformations = () => {
    transformations.forEach((transformation) => {
      transformation.isActive = false;
    });
  };

  const [tokenLimitValue, setTokenLimitValue] = useState(8000);
  const handleModelChange = (newTokenLimitValue: number) => {
    setTokenLimitValue(newTokenLimitValue);
  };

  const handleTransformationClick = (index: number) => {
    transformations[index].isActive = !transformations[index].isActive;
    const transformedContent = applyActiveTransformations(fileContent ?? '');
    setProcessedFileContent(transformedContent);
  };


  return (
    <div className="max-w-4xl mx-auto">
      <header className="w-full py-10 text-2xl font-light tracking-widest">
        <h1>Core Content</h1>
      </header>
      <main className="flex space-x-4">
        <div className="w-1/3 col1">
          <FileUpload onFileUpload={handleFileUpload} loading={loading} />
          <PromptInput promptText={promptText} onPromptTextChange={setPromptText} />
          <ModelSelection onModelChange={handleModelChange} />
        </div>
        <div className="w-2/3 col2 px-4 border-l">
          <ContentDisplay
            promptText={promptText}
            descriptionString={descriptionString}
            processedFileContent={processedFileContent}
            onCopy={copyToClipboard}
            copyButtonText={copyButtonText}
          />

          <TokenInfo text={`${processedFileContent}${promptText}${descriptionString}`} tokenLimitValue={tokenLimitValue} />
          <TransformationButtons
            transformations={transformations}
            onTransformationClick={handleTransformationClick}
          />
        </div>
      </main>
    </div>
  );
}
