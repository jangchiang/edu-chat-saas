// src/app/components/Header.tsx
'use client'

import { BookOpen } from 'lucide-react'

export const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">EduChat AI</h1>
              <p className="text-sm text-gray-500">Your Educational Assistant</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
            <a href="#subjects" className="text-gray-600 hover:text-gray-900">Subjects</a>
            <a href="#about" className="text-gray-600 hover:text-gray-900">About</a>
          </nav>
        </div>
      </div>
    </header>
  )
}