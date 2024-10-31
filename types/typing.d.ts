import { Dayjs } from "dayjs"

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
  charCount: number
}

export interface Record {
  registered_by: number
  language: string
  type: string
  avg_wpm: number
  avg_cpm: number
  max_wpm: number
  max_cpm: number
  avg_accuracy: number
  avg_progress: number
  count: number
  time: number
  char_count: number
  registered_date: Date
}
