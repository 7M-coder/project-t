import { http, HttpResponse } from 'msw'

interface Todo {
  id: number
  todo: string
  completed: boolean
  userId: number
}

interface TodosResponse {
  todos: Todo[]
  total: number
  skip: number
  limit: number
}

// Define types for translations
type SupportedLanguages = 'en' | 'ar'

interface TranslationContent {
  todos: {
    todo_List: string
  }
}

interface CoreTranslations {
  core: TranslationContent
}

type TranslationsType = Record<SupportedLanguages, CoreTranslations>

// Core module translations with both languages
const translations: TranslationsType = {
  en: {
    core: {
      todos: {
        todo_List: 'Todo List'
      }
    }
  },
  ar: {
    core: {
      todos: {
        todo_List: 'قائمة المهام'
      }
    }
  }
}

export const coreHandlers = [
  // Core module API endpoints
  http.get('https://dummyjson.com/todos', () => {
    const response: TodosResponse = {
      todos: [
        { id: 1, todo: 'Do something nice...', completed: true, userId: 26 },
        { id: 2, todo: 'Read a book', completed: false, userId: 27 }
      ],
      total: 2,
      skip: 0,
      limit: 100
    }

    return HttpResponse.json(response, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }),

  // Core module translations
  http.get('/locales/:lng/core.json', ({ params }) => {
    const { lng } = params
    const language = (lng as string).split('-')[0] // Handle language codes like 'en-US'

    // Type guard to check if language is supported
    const isValidLanguage = (lang: string): lang is SupportedLanguages =>
      lang === 'en' || lang === 'ar'

    // Get translations for the language or fallback to English
    const translationsForLanguage = isValidLanguage(language)
      ? translations[language].core
      : translations.en.core

    return HttpResponse.json(translationsForLanguage, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  })
]
