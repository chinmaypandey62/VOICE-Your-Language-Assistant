"use client"

import { useEffect, useRef, useState } from "react"
import { useVoiceStore } from "@/lib/store"
import type SpeechRecognition from "speech-recognition"

export function useSpeechRecognition() {
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const { voiceState, setListening, setCurrentTranscript, addMessage } = useVoiceStore()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        setIsSupported(true)
        recognitionRef.current = new SpeechRecognition()

        const recognition = recognitionRef.current
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = "en-US"

        recognition.onstart = () => {
          setListening(true)
        }

        recognition.onresult = (event) => {
          let interimTranscript = ""
          let finalTranscript = ""

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript
            } else {
              interimTranscript += transcript
            }
          }

          setCurrentTranscript(interimTranscript || finalTranscript)

          if (finalTranscript) {
            addMessage({
              type: "user",
              content: finalTranscript.trim(),
            })

            // Simulate AI response
            setTimeout(() => {
              const responses = [
                "I understand what you're saying. How can I help you further?",
                "That's interesting! Tell me more about that.",
                "I'm processing your request. What would you like to know?",
                "Thanks for sharing that with me. What's your next question?",
                "I'm here to help. What else can I assist you with?",
              ]
              const randomResponse = responses[Math.floor(Math.random() * responses.length)]
              addMessage({
                type: "ai",
                content: randomResponse,
              })
            }, 1000)
          }
        }

        recognition.onerror = (event) => {
          console.error("Speech recognition error:", event.error)
          setListening(false)
        }

        recognition.onend = () => {
          setListening(false)
          setCurrentTranscript("")
        }
      }
    }
  }, [setListening, setCurrentTranscript, addMessage])

  const startListening = () => {
    if (recognitionRef.current && !voiceState.isListening) {
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && voiceState.isListening) {
      recognitionRef.current.stop()
    }
  }

  return {
    isSupported,
    startListening,
    stopListening,
  }
}
