// Types for the Legal Action Execution System

export interface Classification {
  category: string;
  possible_issues: string[];
  urgency: "low" | "medium" | "high";
  summary: string;
}

export interface FollowUpQuestion {
  id: string;
  question: string;
  type: "text" | "select" | "boolean";
  options?: string[];
  required: boolean;
}

export interface LegalOption {
  name: string;
  description: string;
  pros: string[];
  cons: string[];
  estimated_cost: string;
  estimated_time: string;
}

export interface DecisionResult {
  options: LegalOption[];
  recommended: string;
  reason: string;
}

export interface WorkflowStep {
  step: number;
  title: string;
  description: string;
  action_type: "document" | "visit" | "online" | "lawyer" | "call";
  cta: string;
  time_estimate: string;
  required_documents: string[];
  details?: string;
}

export interface GeneratedDocument {
  document_type: string;
  content: string;
  instructions: string;
}

export interface TrackingItem {
  id: string;
  task: string;
  status: "pending" | "in_progress" | "completed";
  step_number: number;
}

export type ActionStage =
  | "input"
  | "classifying"
  | "classified"
  | "answering"
  | "analyzing"
  | "results"
  | "generating_doc"
  | "document_ready";
