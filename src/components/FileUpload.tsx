import React, { useRef } from 'react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  loading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, loading }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      alert('Please select a file handleChange');
      return;
    }

    const file = event.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="mb-3 border-b border-teal pb-3">
      <h3 className="text-lg tracking-wide">Select your data</h3>
      <div>
        <input
          className="w-full border border-teal mt-2"
          type="file"
          ref={fileInputRef}
          onChange={handleChange}
          accept=".doc,.docx,.pdf,.json,.txt,.html"
          disabled={loading}
        />
        <small className="text-xs text-right">
          Allowed files: .html, .docx, .txt, .json, .pdf
        </small>
      </div>
    </div>
  );
};

export default FileUpload;
