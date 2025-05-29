"use client"

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Grip, X } from 'lucide-react'
import { Feature } from '@/lib/firestore-v2'

interface FeatureCardProps {
  feature: Feature
  isDraggable?: boolean
  onRemove?: () => void
  onDragStart?: (e: React.DragEvent, feature: Feature) => void
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  feature, 
  isDraggable = false,
  onRemove,
  onDragStart 
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    if (isDraggable && onDragStart) {
      onDragStart(e, feature)
    }
  }

  return (
    <Card 
      className="mb-3 relative"
      draggable={isDraggable}
      onDragStart={handleDragStart}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          {isDraggable && (
            <div className="mt-1 cursor-grab">
              <Grip size={16} className="text-slate-600 dark:text-slate-400" />
            </div>
          )}
          <div className="flex-1">
            <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">{feature.name}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">{feature.description}</p>
          </div>
          {onRemove && (
            <button 
              onClick={onRemove}
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 p-1"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default FeatureCard 