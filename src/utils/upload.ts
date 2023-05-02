import { useState } from 'react';
import mammoth from 'mammoth';
import cheerio from 'cheerio';
import TurndownService from 'turndown';

const useFileReader = () => {
  const [fileContent, setFileContent] = useState<string | null>(null);

  const processFile = async (file: File) => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    switch (fileExtension) {
      case 'json':
      case 'txt':
        await handleTextFile(file);
        break;
      case 'doc':
      case 'docx':
        await handleDocFile(file);
        break;
      case 'pdf':
        await handlePdfFile(file);
        break;
      case 'html':
        await handleHtmlFile(file);
        break;
      default:
        alert('Invalid file type');
    }
  };

  const handleHtmlFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const html = event.target?.result as string;
      const $ = cheerio.load(html);

      let content;
      if ($('article').length) {
        content = $('article').html();
      } else if ($('main').length) {
        content = $('main').html();
      } else {
        content = $('body').html() || html;
      }

      if (content) {
        const turndownService = new TurndownService();
        const markdown = turndownService.turndown(content);
        // const shortenedContent = markdown.replace(/(.{30})/g, '$1 ');
        console.log(markdown);
        setFileContent(markdown);
      } else {
        console.error('HTML content is null');
      }

    };
    reader.readAsText(file);
  };

  const handleTextFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setFileContent(text);
    };
    reader.readAsText(file);
  };

  const handleDocFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const buffer = event.target?.result as ArrayBuffer;
      const docContent = await mammoth.extractRawText({ arrayBuffer: buffer });
      setFileContent(docContent.value);
    };
    reader.readAsArrayBuffer(file);
  };

  const handlePdfFile = async (file: File) => {
    async function setWorkerSrc() {
      const pdfjsLib = await import('pdfjs-dist');
      const workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
    }

    // Set workerSrc before processing the PDF file
    await setWorkerSrc();

    const reader = new FileReader();
    reader.onload = async (event) => {
      const buffer = event.target?.result as ArrayBuffer;
      const uint8Array = new Uint8Array(buffer);

      // Dynamic import of pdfjs-dist
      const { getDocument } = await import('pdfjs-dist');

      const pdfDocument = await getDocument(uint8Array).promise;
      const totalPages = pdfDocument.numPages;
      let textContent = '';

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const page = await pdfDocument.getPage(pageNum);
        const content = await page.getTextContent();
        textContent += content.items
          .filter((item) => 'str' in item)
          .map((item) => (item as any).str)
          .join(' ') + '\n';
      }

      setFileContent(textContent);
    };
    reader.readAsArrayBuffer(file);
  };




  return { fileContent, processFile };
};

export default useFileReader;
