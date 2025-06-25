// StudyBuddy API Client
const API_BASE_URL = "http://localhost:8000/api";

export interface User {
  id: number;
  email: string;
  full_name: string;
  credits: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  full_name: string;
  password: string;
}

export interface ChatRequest {
  message: string;
  subject?: string;
}

export interface ChatResponse {
  message: string;
  credits_remaining: number;
}

export interface AuthResponse {
  id: number;
  email: string;
  full_name: string;
  credits: number;
  access_token: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem("studybuddy_token");
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || `HTTP ${response.status}`);
    }
    return response.json();
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem("studybuddy_token", token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem("studybuddy_token");
  }

  // Authentication endpoints
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/auth/register`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    const result = await this.handleResponse<AuthResponse>(response);
    this.setToken(result.access_token);
    return result;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: "POST",
      body: formData,
    });

    const result = await this.handleResponse<AuthResponse>(response);
    this.setToken(result.access_token);
    return result;
  }

  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${this.baseUrl}/user/me`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse<User>(response);
  }

  // Chat endpoints
  async sendMessage(data: ChatRequest): Promise<ChatResponse> {
    const response = await fetch(`${this.baseUrl}/chat`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<ChatResponse>(response);
  }

  async sendImage(file: File, message?: string): Promise<ChatResponse> {
    const formData = new FormData();
    formData.append("file", file);
    if (message) {
      formData.append("message", message);
    }

    const headers: HeadersInit = {};
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}/chat/image`, {
      method: "POST",
      headers,
      body: formData,
    });

    return this.handleResponse<ChatResponse>(response);
  }

  async getChatHistory(): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/chat/history`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse<any[]>(response);
  }

  // Credits endpoints
  async getCredits(): Promise<{ credits: number }> {
    const response = await fetch(`${this.baseUrl}/credits`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse<{ credits: number }>(response);
  }

  async purchaseCredits(
    amount: number,
  ): Promise<{ message: string; new_balance: number }> {
    const formData = new FormData();
    formData.append("amount", amount.toString());

    const headers: HeadersInit = {};
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}/credits/purchase`, {
      method: "POST",
      headers,
      body: formData,
    });

    return this.handleResponse<{ message: string; new_balance: number }>(
      response,
    );
  }
}

export const apiClient = new ApiClient();

// Helper functions for detecting subjects
export const detectSubject = (message: string): string | undefined => {
  const mathKeywords = [
    "calculate",
    "solve",
    "equation",
    "add",
    "subtract",
    "multiply",
    "divide",
    "fraction",
    "percentage",
    "algebra",
    "geometry",
    "math",
  ];
  const scienceKeywords = [
    "experiment",
    "hypothesis",
    "biology",
    "chemistry",
    "physics",
    "atom",
    "molecule",
    "energy",
    "force",
    "science",
  ];
  const englishKeywords = [
    "essay",
    "paragraph",
    "grammar",
    "sentence",
    "verb",
    "noun",
    "adjective",
    "write",
    "composition",
    "english",
  ];

  const lowerMessage = message.toLowerCase();

  if (mathKeywords.some((keyword) => lowerMessage.includes(keyword))) {
    return "math";
  }
  if (scienceKeywords.some((keyword) => lowerMessage.includes(keyword))) {
    return "science";
  }
  if (englishKeywords.some((keyword) => lowerMessage.includes(keyword))) {
    return "english";
  }

  return undefined;
};
