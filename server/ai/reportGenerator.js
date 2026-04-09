import { generateAIResponse } from "./OpenRouterClient.js";
const generateReport = async (metrics) => {
  const prompt = `
Analyze this API simulation:

URL: ${metrics.apiUrl}
Users: ${metrics.concurrentUsers}
Failure Rate: ${metrics.failureRate}%
Latency: ${metrics.latency}ms
Avg Response: ${metrics.averageResponseTime}ms
Success: ${metrics.successCount}
Failures: ${metrics.failureCount}

Give:
1. Summary
2. Performance insights
3. Risk level
4. 3 improvements
`;

  try {
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("AI request timeout (30s)")), 30000)
    );

    const result = await Promise.race([
      generateAIResponse(prompt),
      timeout
    ]);

    return result;
  } catch (error) {
    console.error("AI Report Generation Error:", error.message);

    return `
# Simulyn Resilience Report

## Error
AI generation failed: ${error.message}

## Metrics
- Success: ${metrics.successCount}
- Failures: ${metrics.failureCount}
- Avg Response: ${metrics.averageResponseTime}ms
`;
  }
};

export default generateReport;