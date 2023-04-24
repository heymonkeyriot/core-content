import { useState } from 'react';
import { GPT4_TOKEN_LIMIT, GPT3_5_TOKEN_LIMIT } from '../utils/counts';

type ModelSelectionRadioProps = {
  onModelChange: (tokenLimitValue: number) => void;
};

const ModelSelectionRadio: React.FC<ModelSelectionRadioProps> = ({ onModelChange }) => {
  const [selectedModel, setSelectedModel] = useState('GPT4');

  const handleModelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.value;
    setSelectedModel(selected);
    const tokenLimitValue = selected === 'GPT4' ? GPT4_TOKEN_LIMIT : GPT3_5_TOKEN_LIMIT;
    onModelChange(tokenLimitValue);
  };

  return (
    <div className='grid gap-2 grid-cols-2'>
      <label>
        <input
          type="radio"
          value="GPT4"
          checked={selectedModel === 'GPT4'}
          onChange={handleModelChange}
        />
        <span className='pl-2'>GPT4</span>
      </label>
      <label>
        <input
          type="radio"
          value="GPT3.5"
          checked={selectedModel === 'GPT3.5'}
          onChange={handleModelChange}
        />
<span className='pl-2'>GPT3.5</span>
      </label>
    </div>
  );
};

export default ModelSelectionRadio;
