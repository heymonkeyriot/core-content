import React from 'react';

interface PromptInputProps {
    promptText: string;
    onPromptTextChange: (text: string) => void;
}

const PromptInput: React.FC<PromptInputProps> = ({ promptText, onPromptTextChange }) => {
    const handlePromptTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        onPromptTextChange(event.target.value);
    };

    return (
        <div className="mb-3 border-b border-teal pb-3">
            <h3 className="text-lg tracking-wide">
                What do you want to know?</h3>
            <textarea
                onChange={handlePromptTextChange}
                value={promptText}
                className="w-full border border-teal focus:border-teal bg-darkBlue text-accent-400 focus:border-2 mt-2 text-sm"
                rows={4}
                placeholder='e.g. Summarise the above data into 10 separate bullet-points that can be used within a PowerPoint presentation'
            ></textarea>
        </div>
    );
};

export default PromptInput;
