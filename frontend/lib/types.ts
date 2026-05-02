export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  academicLevel?: string | null;
  academicDetails?: string | null;
}

export interface UpdateProfileRequest {
  name?: string;
  academicLevel?: string;
  academicDetails?: string;
}

export interface AuthResponse {
  token: string;
  user: UserResponse;
}

export interface CreateSessionRequest {
  paperName: string;
  level: string;
  mode: "NORMAL" | "PREP_RUSH" | "QA_PRACTICE";
}

export interface SessionResponse {
  sessionId: number;
  paperName: string;
  level: string;
  mode: "NORMAL" | "PREP_RUSH" | "QA_PRACTICE";
  createdAt: string;
}

export interface ImportantPointsRequest {
  sessionId: number;
  topicName: string;
}

export interface ImportantPointsResponse {
  topicName: string;
  importantPoints: string[];
  savedTopicId: number;
}

export interface QuizRequest {
  sessionId: number;
  topicName: string;
  numberOfQuestions: number;
}

export interface QuizQuestionResponse {
  id: number;
  question: string;
  options: string[];
  correctOption: number;
}

export interface QuizResponse {
  questions: QuizQuestionResponse[];
}

export interface QuizAnswerItem {
  questionId: number;
  selectedOption: number;
}

export interface QuizSubmitRequest {
  sessionId: number;
  topicName: string;
  answers: QuizAnswerItem[];
}

export interface QuizResultItem {
  questionId: number;
  isCorrect: boolean;
}

export interface QuizResultResponse {
  score: number;
  total: number;
  results: QuizResultItem[];
}

export interface PrepRushGenerateRequest {
  sessionId: number;
}

export interface PrepRushResponse {
  importantTopics: string[];
  revisionPlan: Record<string, string[]>;
}

export interface TopicDetailRequest {
  sessionId: number;
  topicName: string;
}

export interface TopicDetailResponse {
  topicName: string;
  explanation: string;
  realWorldExample: string;
  idealAnswerFormat: string;
  savedTopicId: number;
}

// Q&A Mode
export interface QAQuestionRequest {
  sessionId: number;
  topicName: string;
  difficulty?: string;
}

export interface QAQuestionResponse {
  question: string;
  difficulty: string;
}

export interface QAEvaluationRequest {
  sessionId: number;
  topicName: string;
  question: string;
  userAnswer: string;
}

export interface QAEvaluationResponse {
  score: number;
  feedback: string;
  idealAnswer: string;
}

export interface SessionSummary {
  id: number;
  paperName: string;
  mode: string;
  createdAt: string;
}

export interface AnalyticsResponse {
  totalSessions: number;
  totalQuizzes: number;
  quizAccuracyPercentage: number;
  totalQAPractice: number;
  averageQAScore: number;
  recentSessions: SessionSummary[];
}
