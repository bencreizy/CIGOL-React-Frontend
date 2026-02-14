export interface Message {
    id: string;
    role: 'user' | 'bot';
    text: string;
    image?: string; // Base64 string for preview
}

export type TabType = 'console' | 'files' | 'notes';