/**
 * Custom Action: Generate Task Description
 * Generates task descriptions using OpenAI based on task titles
 */

// Declare globals available in Apper serverless environment
const apper = globalThis.apper;
const Response = globalThis.Response || class Response {
  constructor(body, options = {}) {
    this.body = body;
    this.status = options.status || 200;
    this.headers = new Map(Object.entries(options.headers || {}));
  }
};

export default {
  async fetch(request) {
    return apper.serve(async () => {
      try {
        // Only accept POST requests
        if (request.method !== 'POST') {
          return new Response(
            JSON.stringify({ success: false, error: 'Method not allowed' }),
            { status: 405, headers: { 'Content-Type': 'application/json' } }
          );
        }

        const { title } = await request.json();

        // Validate input
        if (!title || typeof title !== 'string' || title.trim().length === 0) {
          return new Response(
            JSON.stringify({ success: false, error: 'Title is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }

        // Get OpenAI API key from secrets
        const openaiApiKey = await apper.getSecret('OPENAI_API_KEY');
        if (!openaiApiKey) {
          return new Response(
            JSON.stringify({ success: false, error: 'OpenAI API key not configured' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        }

        // Call OpenAI API
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: 'You are a helpful assistant that creates concise, actionable task descriptions based on task titles. Keep descriptions to 1-2 sentences, be specific and practical. Focus on the key actions or outcomes expected.'
              },
              {
                role: 'user',
                content: `Create a task description for: "${title.trim()}"`
              }
            ],
            max_tokens: 150,
            temperature: 0.7
          })
        });

        if (!openaiResponse.ok) {
          const errorData = await openaiResponse.json().catch(() => null);
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: `OpenAI API error: ${openaiResponse.status} ${openaiResponse.statusText}` 
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        }

        const openaiData = await openaiResponse.json();
        const description = openaiData.choices?.[0]?.message?.content?.trim();

        if (!description) {
          return new Response(
            JSON.stringify({ success: false, error: 'Failed to generate description' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ success: true, description }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

      } catch (error) {
        console.error('Generate task description error:', error);
        return new Response(
          JSON.stringify({ success: false, error: 'Internal server error' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    });
  }
};