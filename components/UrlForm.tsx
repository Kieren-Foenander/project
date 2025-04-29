"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, UtensilsCrossed } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import RecipeDisplay from "./RecipeDisplay";
import { LoadingIndicator } from "./LoadingIndicator";

// Form validation schema
const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function UrlForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setRecipe(null);
    
    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: values.url }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to process recipe");
      }

      const data = await response.json();
      setRecipe(data.processedRecipe);
      setCurrentUrl(values.url);
      
      toast({
        title: "Recipe extracted!",
        description: "We've cut through the fluff for you.",
      });
      
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Something went wrong",
        description: error.message || "Failed to extract recipe",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6 md:space-y-8">
      <Card className="p-6">
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

      {isLoading && (
        <div className="py-12 flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center h-24 w-24 mb-4">
            <UtensilsCrossed className="h-12 w-12 text-primary animate-pulse" />
          </div>
          <p className="text-center text-muted-foreground">
            Extracting the recipe, skipping the fluff...
          </p>
        </div>
      )}

      {recipe && !isLoading && (
        <RecipeDisplay recipe={recipe} sourceUrl={currentUrl} />
      )}
    </div>
  );
}