"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Star, ArrowRight, Loader2, Code } from 'lucide-react'

interface TechStackItem {
  name: string
  recommended: boolean
  reason: string
}

interface TechStackCategory {
  items: TechStackItem[]
  selected: string
}

interface TechStackData {
  [key: string]: TechStackItem[]
}

interface TechStackSelectionProps {
  techStackData: TechStackData
  selections: Record<string, string>
  onSelectionChange: (category: string, selection: string) => void
  onContinue?: () => void
  isLoading?: boolean
}

const TechStackSelection: React.FC<TechStackSelectionProps> = ({
  techStackData,
  selections,
  onSelectionChange,
  onContinue,
  isLoading = false
}) => {
  const categories = Object.keys(techStackData)

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-[#172B4D] dark:text-white mb-4">Select Technology Stack</h2>
      
      {categories.map(category => (
        <div key={category} className="mb-6">
          <h3 className="text-md font-medium text-[#172B4D] dark:text-white mb-3 capitalize">
            {category}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {techStackData[category].map(item => {
              const isSelected = selections[category] === item.name
              return (
                <Card 
                  key={item.name}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? 'border-[#0052CC] dark:border-blue-500 ring-1 ring-[#0052CC] dark:ring-blue-500' : 'hover:border-[#0052CC] dark:hover:border-blue-500'
                  }`}
                  onClick={() => onSelectionChange(category, item.name)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h4 className="text-sm font-medium text-[#172B4D] dark:text-white">{item.name}</h4>
                          {item.recommended && (
                            <div className="ml-2 text-[#FF8B00] dark:text-yellow-400">
                              <Star size={14} fill="currentColor" />
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-[#6B778C] dark:text-gray-400">{item.reason}</p>
                      </div>
                      {isSelected && (
                        <div className="text-[#0052CC] dark:text-blue-400">
                          <Check size={18} />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      ))}
      
      {onContinue && (
        <div className="flex justify-end mt-8">
          <Button 
            variant="jira" 
            onClick={onContinue}
            className="px-6"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                <span>Generating Sprint Plan...</span>
              </>
            ) : (
              <>
                <span>Continue to Sprint Plan</span>
                <ArrowRight size={16} className="ml-2" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

export default TechStackSelection 