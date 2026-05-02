import axios from "axios";
import { getToken } from "./auth";
import {
  CreateSessionRequest,
  SessionResponse,
  ImportantPointsRequest,
  ImportantPointsResponse,
  QuizRequest,
  QuizResponse,
  QuizSubmitRequest,
  QuizResultResponse,
  PrepRushGenerateRequest,
  PrepRushResponse,
  TopicDetailRequest,
  TopicDetailResponse,
  QAQuestionRequest,
  QAQuestionResponse,
  QAEvaluationRequest,
  QAEvaluationResponse,
  UserResponse,
  UpdateProfileRequest,
  AnalyticsResponse,
} from "./types";

const apiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

apiInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiMethods = {
  // Session
  createSession: async (data: CreateSessionRequest): Promise<SessionResponse> => {
    const response = await apiInstance.post("/sessions", data);
    return response.data;
  },

  // Normal Revision
  getImportantPoints: async (data: ImportantPointsRequest): Promise<ImportantPointsResponse> => {
    const response = await apiInstance.post("/revision/important-points", data);
    return response.data;
  },
  generateQuiz: async (data: QuizRequest): Promise<QuizResponse> => {
    const response = await apiInstance.post("/revision/quiz", data);
    return response.data;
  },
  submitQuiz: async (data: QuizSubmitRequest): Promise<QuizResultResponse> => {
    const response = await apiInstance.post("/revision/quiz/submit", data);
    return response.data;
  },

  // PrepRush Mode
  generatePrepRush: async (data: PrepRushGenerateRequest): Promise<PrepRushResponse> => {
    const response = await apiInstance.post("/prep-rush/generate", data);
    return response.data;
  },
  getTopicDetail: async (data: TopicDetailRequest): Promise<TopicDetailResponse> => {
    const response = await apiInstance.post("/prep-rush/topic-detail", data);
    return response.data;
  },

  // Q&A Mode
  getQAQuestion: async (data: QAQuestionRequest): Promise<QAQuestionResponse> => {
    const response = await apiInstance.post("/qa/question", data);
    return response.data;
  },
  evaluateQAAnswer: async (data: QAEvaluationRequest): Promise<QAEvaluationResponse> => {
    const response = await apiInstance.post("/qa/evaluate", data);
    return response.data;
  },

  // Profile
  getProfile: async (): Promise<UserResponse> => {
    const response = await apiInstance.get("/profile");
    return response.data;
  },
  updateProfile: async (data: UpdateProfileRequest): Promise<UserResponse> => {
    const response = await apiInstance.put("/profile", data);
    return response.data;
  },

  // Analytics
  getAnalytics: async (): Promise<AnalyticsResponse> => {
    const response = await apiInstance.get("/analytics");
    return response.data;
  },
};

export default apiInstance;
