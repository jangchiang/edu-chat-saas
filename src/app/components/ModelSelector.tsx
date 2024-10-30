// src/app/components/ModelSelector.tsx
'use client'

import { Check } from 'lucide-react'
import type { ModelOption } from '@/app/utils/types'
import { MODEL_OPTIONS } from '@/app/utils/constants'

interface ModelSelectorProps {
  selectedModel: ModelOption
  onModelChange: (model: ModelOption) => void
}

export const ModelSelector = ({ selectedModel, onModelChange }: ModelSelectorProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Select AI Model</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MODEL_OPTIONS.map((model) => (
          <button
            key={model.id}
            onClick={() => onModelChange(model)}
            className={`relative flex flex-col p-4 rounded-lg border-2 transition-all ${
              selectedModel.id === model.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
            }`}
          >
            {selectedModel.id === model.id && (
              <div className="absolute top-2 right-2">
                <Check className="w-5 h-5 text-blue-500" />
              </div>
            )}
            <div className="font-medium text-gray-900">{model.name}</div>
            <div className="text-sm text-gray-500 mt-1">{model.description}</div>
            <div className="text-xs text-gray-400 mt-2">Provider: {model.provider}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
