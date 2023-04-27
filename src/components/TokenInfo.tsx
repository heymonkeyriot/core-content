import React from 'react';
import TokenMessage from './TokenMessage';
import { get_encoding } from '@dqbd/tiktoken';

const encoding = get_encoding('cl100k_base');

interface TokenInfoProps {
  text: string;
  tokenLimitValue: number;
}

const getTokenCount = (text: string): number => {
  const tokens = encoding.encode(text);
  return tokens.length;
};

const getTokenCountString = (text: string): string => {
  const tokenCount = getTokenCount(text);
  return `~ ${tokenCount} tokens`;
};

const TokenInfo: React.FC<TokenInfoProps> = ({ text, tokenLimitValue }) => {
  return (
    <div className="w-full border border-black p-2 bg-white mb-4">
      <p className="text-right">
        {getTokenCountString(text)} •{' '}
        <TokenMessage count={getTokenCount(text)} tokenLimitValue={tokenLimitValue} />
      </p>
    </div>
  );
};

export default TokenInfo;
