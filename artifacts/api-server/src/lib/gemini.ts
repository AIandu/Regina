const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.warn("OPENAI_API_KEY is not set — AI analysis will fail");
}

export async function runGeminiJSON<T>(prompt: string): Promise<T> {
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-5.6",
        messages: [
          {
            role: "system",
            content:
              "You are an expert infrastructure analysis AI. Return only valid JSON. Do not use markdown code fences.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `OpenAI API error ${response.status}: ${errorText}`
    );
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error("OpenAI returned an empty response");
  }

  return JSON.parse(text) as T;
}
