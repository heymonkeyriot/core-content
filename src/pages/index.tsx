import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
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
import AboutProject from '@/components/AboutProject';
import CustomHead from '@/components/CustomHeadProps';
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
  const [showAbout, setShowAbout] = useState(false);

  return (
    <>
      <CustomHead
        title="Redact + Reduce"
        description="An experiment in how content can be redacted and reduced before being used in large language models."
        ogImage="https://redactreduce.com/reduce-redact-image.jpg"
        twitterImage="https://redactreduce.com/reduce-redact-image.jpg"
      />
      <div className={`${showAbout ? '' : 'hidden'} backdrop-blur-sm h-screen w-full absolute z-20`}></div>
      <div className="max-w-4xl mx-auto mb-24">
        <header className="w-full p-10 md:p-0 md:py-10 flex justify-between items-center">
          <h1 className={courierPrime.className + " text-3xl tracking-widest"}>Redact + Reduce</h1>
          <Link href='/' className={courierPrime.className + " underline underline-offset-4 pr-6"} onClick={() => setShowAbout(true)}>About</Link>
        </header>
        <AboutProject className={`transform ${showAbout ? 'translate-x-0' : 'translate-x-full'} transition-all duration-300`} onClose={() => setShowAbout(false)} />

        <main className="p-10 md:p-0 md:flex md:space-x-4">
          <div className="w-full md:w-1/3 col1">
            <FileUpload onFileUpload={handleFileUpload} loading={loading} />
            <PromptInput promptText={promptText} onPromptTextChange={setPromptText} />
            <ModelSelection onModelChange={handleModelChange} />
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
          </div>

        </main>
        <div className='px-10 md:p-0 md:flex md:gap-4'>
          <div className='w-full md:w-1/3'>
            <RedactRows onRedact={handleRedact} text={processedFileContent} />
          </div>
          <div className='md:flex-grow pl-6  pr-4'>
            <TransformationButtons
              onFirstLoad={onFirstLoad}
              transformations={transformations}
              onTransformationClick={handleTransformationClick}
            />
          </div>
        </div>
      </div>
      <footer className={'w-full px-10 md:p-2 fixed bottom-0 bg-darkBlue ' + courierPrime.className}>
        <div className=' max-w-4xl mx-auto md:flex md:justify-between'>
          <p className=''>A <Link className="underline underline-offset-2" href="https://ai.torchbox.com.">Torchbox Innovation</Link> project</p>
          <p className='text-sm'>No cookies used in this project</p>
        </div>
      </footer>
    </>
  );
}
