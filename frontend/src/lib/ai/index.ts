import { AIProvider } from "./provider";
import { MockAIProvider } from "./mock-provider";

// Abstract factory to retrieve the current AI provider.
// Easily swap this to `new OpenAIProvider()` or `new GeminiProvider()` in the future
// without modifying any UI or business logic components.

export function getAIProvider(): AIProvider {
  // If we had env vars like process.env.AI_PROVIDER === 'openai', we could switch here.
  return new MockAIProvider();
}
