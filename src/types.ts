export type Difficulty = "Easy" | "Medium" | "Hard";
export type InterviewType = "DSA" | "System Design" | "HR";

export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  createdAt: string;
}

export interface Interview {
  id: string;
  userId: string;
  company: string;
  role: string;
  difficulty: Difficulty;
  type: InterviewType;
  score?: number;
  feedback?: string;
  status: "pending" | "completed";
  createdAt: string;
}

export interface Question {
  id: string;
  text: string;
  type: "conceptual" | "coding";
  difficulty: Difficulty;
  expectedAnswer?: string;
}

export interface Submission {
  id: string;
  userId: string;
  interviewId: string;
  questionId: string;
  language: string;
  code: string;
  result: string;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
}

export interface Role {
  id: string;
  name: string;
}
