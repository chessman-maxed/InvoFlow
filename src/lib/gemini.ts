import { ConversationExtraction } from "./types";

const apiKey = process.env.OPENROUTER_API_KEY || "";

const SYSTEM_INSTRUCTION = `You are an AI assistant specialized in analyzing client-freelancer conversation messages to extract structured invoice requirements.

Analyze the user message and extract:
1. items: List of requested or modified services/products.
   Each item must have:
   - name: The service or product name mentioned (e.g. "Logo Design", "Instagram Post")
   - quantity: Numeric quantity (default to 1 if unspecified)
   - action: "add" | "update" | "remove"
     * "add": For newly requested items
     * "update": When changing quantity or scope of an existing item (e.g. "make it 5 instead of 3")
     * "remove": When cancelling or deleting an item (e.g. "remove logo design", "don't need the poster")
   - confidence: Optional confidence score between 0 and 1

2. clientName: Client's name if mentioned (optional)
3. freelancerName: Freelancer's name if mentioned (optional)
4. budget: Numerical budget amount if mentioned (optional, extract numbers only)
5. notes: Any additional context, specifications, or deadline requirements mentioned (optional)

Respond STRICTLY in valid JSON matching this exact structure:
{
  "items": [
    {
      "name": "string",
      "quantity": 1,
      "action": "add"
    }
  ],
  "clientName": "string or omit",
  "freelancerName": "string or omit",
  "budget": 10000,
  "notes": "string or omit"
}

Do not include markdown formatting or backticks around the JSON. Return only pure raw JSON string.`;

export async function extractInvoiceDetails(
  conversationMessage: string
): Promise<ConversationExtraction> {
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured.");
  }

  if (!conversationMessage || !conversationMessage.trim()) {
    return {
      items: [],
    };
  }

  try {
    const prompt = `${SYSTEM_INSTRUCTION}\n\nClient Conversation Message:\n"${conversationMessage}"`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
        max_tokens: 1000,
        reasoning: { max_tokens: 0 },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";

    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsedData: ConversationExtraction = JSON.parse(cleanedText);

    return {
      items: Array.isArray(parsedData.items) ? parsedData.items : [],
      clientName: parsedData.clientName || undefined,
      freelancerName: parsedData.freelancerName || undefined,
      budget: typeof parsedData.budget === "number" ? parsedData.budget : undefined,
      notes: parsedData.notes || undefined,
    };
  } catch (error) {
    console.error("Error extracting invoice details with OpenRouter:", error);
    throw new Error(
      error instanceof Error
        ? `OpenRouter extraction failed: ${error.message}`
        : "Failed to parse conversation details."
    );
  }
}

