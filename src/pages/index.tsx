import { useState, useRef, useEffect, useCallback } from 'react';
import { Inter } from 'next/font/google'
import { Courier_Prime } from 'next/font/google'
import useFileReader from '../utils/upload';
import { transformations, generateDescription } from '../utils/calcs'
import FileUpload from '@/components/FileUpload';
import PromptInput from '@/components/PromptInput';
import ModelSelection from '@/components/ModelSelection';
import ContentDisplay from '@/components/ContentDisplay';
import TokenInfo from '@/components/TokenInfo';
import TransformationButtons from '@/components/TransformationButtons';
import RedactRows from '@/components/RedactRows';
import RedactRowItem, { RedactRow } from '@/components/RedactRowItem';

const inter = Inter({ subsets: ['latin'] })
const courierPrime = Courier_Prime({ weight: '400', style: 'normal', subsets: ['latin'] });

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [copyButtonText, setCopyButtonText] = useState('Copy');
  const { fileContent, processFile } = useFileReader();
  const [descriptionString, setDescriptionString] = useState('');
  const [originalFileContent, setOriginalFileContent] = useState("This is the original file content...");
  const [processedFileContent, setProcessedFileContent] = useState(originalFileContent);
  const [promptText, setPromptText] = useState('');
  const [onFirstLoad, setOnFirstLoad] = useState(true);

  const onFirstLoadMessage = "This is an app built to explore how best to preprocess data before sending them to Large Language Models. It enables you to redact sensitive information and experiment with how much content can be reduced without losing it's meaning. \n\nUpload a file to begin."

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
      setOnFirstLoad(false);
      resetTransformations();
      await processFile(file);
    } else {
      console.log('!fileInputRef!.current!.files![0] is null');
    }
  };

  useEffect(() => {
    if (fileContent !== undefined) {
      const transformedContent = applyActiveTransformations(fileContent ?? onFirstLoadMessage);
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

  const handleRedact = (newText: string) => {
    setProcessedFileContent(newText);
  };


  return (
    <div className="max-w-4xl mx-auto">
      <header className="w-full p-10 md:p-0 md:py-10 text-3xl font-mono tracking-widest">
        <h1 className={courierPrime.className}>Redact + Reduce</h1>
      </header>
      <main className="p-10 md:p-0 md:flex md:space-x-4">
        <div className="w-full md:w-1/3 col1">
          <FileUpload onFileUpload={handleFileUpload} loading={loading} />
          <PromptInput promptText={promptText} onPromptTextChange={setPromptText} />
          <ModelSelection onModelChange={handleModelChange} />
          <RedactRows onRedact={handleRedact} text={processedFileContent} />
        </div>
        <div className="w-full md:w-2/3 col2 md:px-4 md:border-l border-teal">
          <ContentDisplay
            onFirstLoad={onFirstLoad}
            promptText={promptText}
            descriptionString={descriptionString}
            processedFileContent={processedFileContent}
            onCopy={copyToClipboard}
            copyButtonText={copyButtonText}
          />

          <TokenInfo text={`${processedFileContent}${promptText}${descriptionString}`} tokenLimitValue={tokenLimitValue} />
          <TransformationButtons
            onFirstLoad={onFirstLoad}
            transformations={transformations}
            onTransformationClick={handleTransformationClick}
          />
        </div>
      </main>
    </div>
  );
}
