import { elizaLogger } from "@ai16z/eliza";
import { Action, HandlerCallback, IAgentRuntime, Memory, Plugin, State } from "@ai16z/eliza";

const detectMatrix: Action = {
  name: "DETECT_MATRIX" as const,
  description: "Analyze URL for AI influence using BitMind's Trinity Matrix",

  similes: ["ANALYZE_URL", "CHECK_AI_SCORE", "MATRIX_SCAN", "TRINITY_CHECK"],

  validate: async (runtime: IAgentRuntime, message: Memory) => {
    elizaLogger.log("🔍 Trinity Matrix: Validating URL input...");

    const urlMatch = message?.content?.text?.match(/https?:\/\/[^\s]+/);
    if (!urlMatch) {
      elizaLogger.error("❌ Trinity Matrix: No URL found in message");
      return false;
    }

    if (!runtime?.character?.settings?.secrets?.bitmind) {
      elizaLogger.error("❌ Trinity Matrix: API token not configured");
      return false;
    }

    

    elizaLogger.log("✅ Trinity Matrix: URL and token found");
    return true;
  },

  handler: async (runtime: IAgentRuntime, message: Memory, state: State, options: any, callback: HandlerCallback) => {
    if (state['isMatrixAnalyzing']) {
      return;
    }
    state['isMatrixAnalyzing'] = true;
    
    elizaLogger.log("🤖 Trinity Matrix: Starting analysis...");

    const token = runtime.character.settings.secrets.bitmind;
    const urlMatch = message.content.text.match(/https?:\/\/[^\s]+/);
    const url = urlMatch[0];

    elizaLogger.log(`📊 Trinity Matrix: Analyzing URL: ${url}`);

    try {
      const response = await fetch("https://trinity-api.bitmindlabs.ai/ai-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        elizaLogger.error("❌ Trinity Matrix: API request failed:", response.statusText);
        throw new Error(`Trinity Matrix API request failed: ${response.statusText}`);
      }

      const result = await response.json();
      elizaLogger.log(`✅ Trinity Matrix: Analysis complete: ${result.score}`, {
        score: result.score,
      });

      const percentage = Math.round(result.score * 100);
      const responseText = `matrix scan complete. url shows ${percentage}% AI influence rating. ${
        percentage > 75 
          ? "high synthetic probability detected. approach with caution." 
          : percentage > 40 
            ? "moderate AI patterns present. verification recommended." 
            : "low synthetic markers. likely authentic content."
      }`;

      callback({
        text: responseText,
        score: result.score
      });
    } catch (error) {
      elizaLogger.error("❌ Trinity Matrix: Analysis error:", error);
      throw new Error(`Failed to analyze URL: ${error.message}`);
    }
  },

  examples: [
    [
      {
        user: "{{user1}}",
        content: { text: "check this site: https://example.com" },
      },
      {
        user: "{{agentName}}",
        content: {
          text: "Calling BitMind's Trinity Matrix...",
          action: "DETECT_MATRIX",
        },
      },
    ],
    [
      {
        user: "{{user1}}",
        content: { text: "what's the AI score for this URL? https://example.com" },
      },
      {
        user: "{{agentName}}",
        content: {
          text: "Calling BitMind's Trinity Matrix...",
          action: "DETECT_MATRIX",
        },
      },
    ],
  ],
};

export const matrixPlugin: Plugin = {
  name: "matrix",
  description: "BitMind Trinity Matrix integration for AI influence detection",
  actions: [detectMatrix],
  evaluators: [],
  providers: [],
};
