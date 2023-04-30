export const GPT4_TOKEN_LIMIT = 3950;
export const GPT3_5_TOKEN_LIMIT = 1850;

export enum TokenLimitMessage {
  FAR_BELOW = 'Far below token limit',
  BELOW = 'Below token limit',
  CLOSE = 'Close to token limit',
  JUST_ABOVE = 'Just above token limit',
  ABOVE = 'Above token limit',
  FAR_ABOVE = 'Far above token limit',
}
