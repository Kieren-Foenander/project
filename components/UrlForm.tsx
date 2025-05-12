'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Search, UtensilsCrossed } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import RecipeDisplay from './RecipeDisplay'
import { LoadingIndicator } from './LoadingIndicator'
import { useCompletion } from '@ai-sdk/react'

// Form validation schema
const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL' }),
})

type FormValues = z.infer<typeof formSchema>

export default function UrlForm() {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null)
  const { toast } = useToast()
  const { completion, complete, isLoading } = useCompletion({
    api: '/api/extract',
  })

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
    },
  })

  const onSubmit = async (values: FormValues) => {
    try {
      await complete(values.url)
      setCurrentUrl(values.url)

      toast({
        title: 'Recipe extracted!',
        description: "We've cut through the fluff for you.",
      })
    } catch (error: any) {
      console.error('Error:', error)
      toast({
        title: 'Something went wrong',
        description: error.message || 'Failed to extract recipe',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="w-full space-y-6 md:space-y-8">
      <Card className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Paste a recipe URL here..."
                        {...field}
                        className="flex-1"
                        disabled={isLoading}
                      />
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <LoadingIndicator />
                        ) : (
                          <>
                            <Search className="mr-2 h-4 w-4" />
                            Extract
                          </>
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </Card>
      {completion && (
        <RecipeDisplay
          recipe={completion}
          sourceUrl={currentUrl}
          isStreaming={isLoading}
        />
      )}
    </div>
  )
}
