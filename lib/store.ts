import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: string
  email: string
  name: string
}

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
}

interface VoiceState {
  isListening: boolean
  isProcessing: boolean
  currentTranscript: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
}

interface VoiceStore {
  voiceState: VoiceState
  messages: Message[]
  showFullTranscript: boolean
  setListening: (listening: boolean) => void
  setProcessing: (processing: boolean) => void
  setCurrentTranscript: (transcript: string) => void
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void
  toggleTranscript: () => void
  clearMessages: () => void
}

interface ThemeState {
  isDark: boolean
  toggleTheme: () => void
  setTheme: (isDark: boolean) => void
}

// Auth Store
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        // Mock authentication
        if (email && password) {
          const user = {
            id: "1",
            email,
            name: email.split("@")[0],
          }
          set({ user, isAuthenticated: true })
          return true
        }
        return false
      },
      signup: async (name: string, email: string, password: string) => {
        // Mock signup
        if (name && email && password) {
          const user = {
            id: "1",
            email,
            name,
          }
          set({ user, isAuthenticated: true })
          return true
        }
        return false
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
    },
  ),
)

// Voice Store
export const useVoiceStore = create<VoiceStore>((set, get) => ({
  voiceState: {
    isListening: false,
    isProcessing: false,
    currentTranscript: "",
  },
  messages: [],
  showFullTranscript: false,
  setListening: (listening) =>
    set((state) => ({
      voiceState: { ...state.voiceState, isListening: listening },
    })),
  setProcessing: (processing) =>
    set((state) => ({
      voiceState: { ...state.voiceState, isProcessing: processing },
    })),
  setCurrentTranscript: (transcript) =>
    set((state) => ({
      voiceState: { ...state.voiceState, currentTranscript: transcript },
    })),
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: Date.now().toString(),
          timestamp: new Date(),
        },
      ],
    })),
  toggleTranscript: () => set((state) => ({ showFullTranscript: !state.showFullTranscript })),
  clearMessages: () => set({ messages: [] }),
}))

// Theme Store
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDark: false,
      toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
      setTheme: (isDark) => set({ isDark }),
    }),
    {
      name: "theme-storage",
    },
  ),
)
