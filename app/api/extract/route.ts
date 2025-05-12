import { NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';
import TurndownService from 'turndown';
import { generateText, streamText } from "ai"
import { google } from "@ai-sdk/google"
import { Construction } from 'lucide-react';

// Initialize turndown for HTML to Markdown conversion
const turndownService = new TurndownService();

export async function POST(request: Request) {
  try {
    // prompt is actually just a url to fetch but using like this to work with ai sdk
    const { prompt }: { prompt: string } = await request.json();

    // Fetch the webpage content
    const res = await fetch(prompt);
    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${res.statusText}` },
        { status: 500 }
      );
    }

    const html = await res.text();

    // Parse the HTML
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Extract the main content (this is a simple approach and might need refinement)
    let content = '';

    // Try to find recipe-specific content
    const recipeElements = document.querySelectorAll('[itemtype*="Recipe"], .recipe, .recipe-content, article');

    if (recipeElements.length > 0) {
      content = recipeElements[0].innerHTML;
    } else {
      const mainContent = document.querySelector('main, .main, #main, article, .content, .post-content');
      if (mainContent) {
        content = mainContent.innerHTML;
      } else {
        content = document.body.innerHTML;
      }
    }

    // Convert HTML to Markdown
    const markdown = turndownService.turndown(content);


    const newPrompt = `Extract ONLY the recipe title, ingredients list, and cooking instructions from this blog post.
Format the output in markdown with clear sections.
DO NOT include any blog stories, anecdotes, or fluff content.
DO NOT make up any information - only extract what's in the original content.
Ensure that cooking instructions is an ordered list format.
Provide conversions directly to the ingredients in brackets for different metric systems, such as cups to ml, ounces to grams, etc. for example "1 cup flour" to "1 cup (250g) flour". It is fine to average to a nice round number also to make for easier reading 
If you can't find recipe information, say "No recipe found in this content."`;

    const result = await streamText({
      model: google("gemini-2.0-flash") as any,
      prompt: `${newPrompt} recipe: ${markdown}`
    })
    return result.toDataStreamResponse()
  } catch (error: any) {
    console.error('Error processing recipe:', error);
    return NextResponse.json(
      { error: `Failed to process recipe: ${error.message}` },
      { status: 500 }
    );
  }
}