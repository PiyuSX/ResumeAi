interface FSItem {
  id: string;
  uid: string;
  name: string;
  path: string;
  is_dir: boolean;
  parent_id: string;
  parent_uid: string;
  created: number;
  modified: number;
  accessed: number;
  size: number | null;
  writable: boolean;
}

interface PuterUser {
  uuid: string;
  username: string;
}

interface KVItem {
  key: string;
  value: string;
}

interface ChatMessageContent {
  type: "file" | "text";
  puter_path?: string;
  text?: string;
}

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string | ChatMessageContent[];
}

interface PuterChatOptions {
  model?: string;
  stream?: boolean;
  max_tokens?: number;
  temperature?: number;
}

interface AIResponse {
  index: number;
  message: {
    role: string;
    content: string | ChatMessageContent[];
    refusal: string | null;
    annotations: unknown[];
  };
  finish_reason: string;
}