import { TokenLimitMessage } from '../utils/counts';

type TokenMessageProps = {
  count: number;
  tokenLimitValue: number;
};

const TokenMessage: React.FC<TokenMessageProps> = ({ count, tokenLimitValue }) => {
  const determineTokenLimitMessage = (tokenCount: number) => {
    const ratio = tokenCount / tokenLimitValue;

    if (ratio <= 0.5) return TokenLimitMessage.FAR_BELOW;
    if (ratio <= 0.8) return TokenLimitMessage.BELOW;
    if (ratio <= 1.0) return TokenLimitMessage.CLOSE;
    if (ratio <= 1.2) return TokenLimitMessage.JUST_ABOVE;
    if (ratio <= 1.5) return TokenLimitMessage.ABOVE;
    return TokenLimitMessage.FAR_ABOVE;
  };

  return (
      <span>{determineTokenLimitMessage(count)}</span>
  );
};

export default TokenMessage;
