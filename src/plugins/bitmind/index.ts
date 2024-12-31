import { elizaLogger } from "@ai16z/eliza";
import { Action, HandlerCallback, IAgentRuntime, Memory, Plugin, State } from "@ai16z/eliza";

const detectImage: Action = {
  name: "DETECT_IMAGE" as const,
  description: "Detect if an image is AI-generated using BitMind API",

  similes: ["ANALYZE_IMAGE", "BITMIND_DETECTION", "AI_DETECTION", "REAL_OR_FAKE"],

  validate: async (runtime: IAgentRuntime, message: Memory) => {
    elizaLogger.log("🔍 BitMind: Validating image input...");

    const urlMatch = message?.content?.text?.match(/https?:\/\/[^\s]+/);
    if (!urlMatch) {
      elizaLogger.error("❌ BitMind: No image URL found in message");
      return false;
    }

    if (!runtime?.character?.settings?.secrets?.bitmind) {
      elizaLogger.error("❌ BitMind: API token not configured");
      return false;
    }

    elizaLogger.log("✅ BitMind: Image URL and token found");
    return true;
  },

  handler: async (runtime: IAgentRuntime, message: Memory, state: State, options: any, callback: HandlerCallback) => {
    if (state['isAnalyzing']) {
      return;
    }
    state['isAnalyzing'] = true;
    
    elizaLogger.log("🤖 BitMind: Starting image detection...");

    const token = runtime.character.settings.secrets.bitmind;
    const urlMatch = message.content.text.match(/https?:\/\/[^\s]+/);
    const imageUrl = urlMatch[0];

    elizaLogger.log(`📸 BitMind: Analyzing image: ${imageUrl}`);

    try {
      const response = await fetch("https://subnet-api.bitmindlabs.ai/detect-image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageUrl }),
      });

      if (!response.ok) {
        elizaLogger.error("❌ BitMind: API request failed:", response.statusText);
        throw new Error(`BitMind API request failed: ${response.statusText}`);
      }

      const result = await response.json();
      elizaLogger.log("✅ BitMind: Detection complete", {
        isAI: result.isAI,
        confidence: result.confidence,
      });

      const responseText = `According to BitMind's Deepfake Detection Subnet, the image ${
        result.isAI ? "appears to be" : "does not appear to be"
      } AI-generated (${Math.round(result.confidence * 100)}% confidence of AI generation).`;

      callback({
        text: responseText,
        isAI: result.isAI,
        confidence: result.confidence,
      });
    } catch (error) {
      elizaLogger.error("❌ BitMind: Detection error:", error);
      throw new Error(`Failed to detect image: ${error.message}`);
    }
  },

  examples: [
    [
      {
        user: "{{user1}}",
        content: { text: "analyze this image: https://example.com/image.jpg" },
      },
      {
        user: "{{agentName}}",
        content: {
          text: "I'll analyze that image for you...",
          action: "DETECT_IMAGE",
        },
      },
    ],
    [
      {
        user: "{{user1}}",
        content: { text: "is this image AI generated?" },
      },
      {
        user: "{{agentName}}",
        content: {
          text: "Let me check if that image is AI generated...",
          action: "DETECT_IMAGE",
        },
      },
    ],
  ],
} as Action;

export const bitmindPlugin: Plugin = {
  name: "bitmind",
  description: "BitMind API integration for synthetic content detection",
  actions: [detectImage],
  evaluators: [],
  providers: [],
};
