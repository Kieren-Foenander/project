'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Printer, Share2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { useToast } from '@/hooks/use-toast'

interface RecipeDisplayProps {
  recipe: string
  sourceUrl: string | null
  isStreaming: boolean
}

export default function RecipeDisplay({
  recipe,
  sourceUrl,
  isStreaming,
}: RecipeDisplayProps) {
  const [activeTab, setActiveTab] = useState('recipe')
  const { toast } = useToast()

  const modifiedRecipe = (recipe: string) => {
    const markdownRegex = isStreaming
      ? /```markdown\s*([\s\S]*)/i
      : /```markdown\s*([\s\S]*?)```/i

    const match = recipe.match(markdownRegex)

    let markdownContent
    if (match && match[1] != null) {
      markdownContent = match[1].trim()
    } else {
      markdownContent = recipe.trim()
    }
    return markdownContent
  }

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Just Let Me Cook - Recipe',
          text: 'Check out this recipe I found!',
          url: window.location.href,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: 'Link copied!',
          description: 'Recipe link copied to clipboard',
        })
      } catch (error) {
        console.error('Error copying to clipboard:', error)
        toast({
          title: "Couldn't copy link",
          description: 'Please copy the URL manually',
          variant: 'destructive',
        })
      }
    }
  }

  return (
    <Card className="w-full print:shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl md:text-2xl">Your Recipe</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="recipe"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="recipe">Recipe</TabsTrigger>
            <TabsTrigger value="source">Source</TabsTrigger>
          </TabsList>
          <TabsContent value="recipe" className="mt-0">
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <ReactMarkdown>{modifiedRecipe(recipe)}</ReactMarkdown>
            </div>
          </TabsContent>
          <TabsContent value="source" className="mt-0">
            <div className="p-4 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground mb-2">
                Original recipe source:
              </p>
              <a
                href={sourceUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary break-all"
              >
                {sourceUrl}
              </a>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
