export interface RuleForm {
  requester: string
  language: string
  sentenceType: string
  otherSentenceType: boolean
  comment?: string
  source: string
  sentence: string
  explanation: string
}

export interface TypingInfo {
  targetLanguage: string
  targetSentenceType: string
  avgWpm: number
  avgCpm: number
  maxWpm: number
  maxCpm: number
  avgAccuracy: number
  avgProgress: number
  count: number
  entireElapsedTime: number
}
