import React, { useRef, useState } from 'react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  loading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, loading }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [fileName, setFileName] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      alert('Please select a file handleChange');
      return;
    }

    const file = event.target.files[0];
    if (file) {
      onFileUpload(file);
      setFileName(file.name);
    }
  };

  return (
    <div className="mb-3 border-b border-teal pb-3">
      <h3 className="text-lg tracking-wide">Select your data</h3>
      <div>
        <input
          className="hidden w-full border border-teal mt-2"
          type="file"
          ref={fileInputRef}
          onChange={handleChange}
          accept=".doc,.docx,.pdf,.json,.txt,.html"
          disabled={loading}
        />
        <button
          className="w-full border border-teal text-teal text-left px-2 text-sm py-1 mt-2"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
        >
          {fileName
            ? 'Change file | ' + fileName.slice(0, 20) + (fileName.length > 20 ? '...' : '')
            : 'Choose file'}
        </button>
        <small className="text-xs text-right">
          Allowed files: .html, .docx, .txt, .json, .pdf
        </small>
      </div>
    </div>
  );
};

export default FileUpload;
