import { NextResponse } from 'next/server';
import { JSDOM } from 'jsdom';
import TurndownService from 'turndown';
import { generateText } from "ai"
import { google } from "@ai-sdk/google"

// Initialize turndown for HTML to Markdown conversion
const turndownService = new TurndownService();

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Fetch the webpage content
    const res = await fetch(url);
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


    const prompt = `Extract ONLY the recipe title, ingredients list, and cooking instructions from this blog post.
Format the output in markdown with clear sections.
DO NOT include any blog stories, anecdotes, or fluff content.
DO NOT make up any information - only extract what's in the original content.
Ensure that cooking instructions is an ordered list format.
Provide conversions directly to the ingredients in brackets for different metric systems, such as cups to ml, ounces to grams, etc. for example "1 cup flour" to "1 cup (250g) flour". It is fine to average to a nice round number also to make for easier reading 
If you can't find recipe information, say "No recipe found in this content."`;

    const { text } = await generateText({
      model: google("gemini-2.0-flash") as any,
      prompt: `${prompt} recipe: ${markdown}`
    })

    const MARKDOWN_BLOCK_RE =
      /```markdown\s*([\s\S]*?)```/i;

    // Execute the regex
    const match = text.match(MARKDOWN_BLOCK_RE);

    let markdownContent;
    if (match && match[1] != null) {
      // match[1] is the captured group
      markdownContent = match[1].trim();
    } else {
      // Fallback: no wrapping ``` found
      markdownContent = text.trim();
    }


    return NextResponse.json({
      originalUrl: url,
      processedRecipe: markdownContent,
    });
  } catch (error: any) {
    console.error('Error processing recipe:', error);
    return NextResponse.json(
      { error: `Failed to process recipe: ${error.message}` },
      { status: 500 }
    );
  }
}