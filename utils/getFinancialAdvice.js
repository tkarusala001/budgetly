import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY);

// Function to generate personalized financial advice
const getFinancialAdvice = async (totalBudget, totalIncome, totalSpend) => {
  console.log(totalBudget, totalIncome, totalSpend);

  try {
    // Initialize the model (using Gemini-Pro for text generation)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Calculate some financial metrics
    const savingsRate = ((totalIncome - totalSpend) / totalIncome * 100).toFixed(2);
    const budgetUtilization = ((totalSpend / totalBudget) * 100).toFixed(2);
    const monthlyDiscretionary = totalIncome - totalSpend;

    const userPrompt = `
     DONT USE SYMBOLS LIKE '*' OR '!' OR EXCESSIVE '-' IN YOUR RESPONSE. MAKE IT SENTENCE-STYLE. MAKE IT NATURAL.
      As a financial advisor, analyze these financial metrics and provide specific, actionable advice:

      Current Financial Situation:
      - Monthly Budget Allocation: $${totalBudget}
      - Monthly Income: $${totalIncome}
      - Monthly Expenses: $${totalSpend}
      - Current Savings Rate: ${savingsRate}%
      - Budget Utilization: ${budgetUtilization}%
      - Discretionary Income: $${monthlyDiscretionary}

      Consider these aspects in your analysis:
      1. Savings and emergency fund status
      2. Budget allocation effectiveness
      3. Spending patterns
      4. Income utilization
      5. Financial goals and priorities

      Please provide 2-3 concise, practical sentences of financial advice that:
      - Identifies the most critical area for improvement
      - Suggests specific, actionable steps
      - Includes numbers/percentages where relevant
      - Focuses on both immediate actions and long-term benefits
      - Maintains an encouraging but professional tone

      Avoid generic advice like "spend less" or "save more" - instead, provide specific, quantifiable recommendations based on the current financial situation.
      
    `;

    // Generate content using Gemini
    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    const advice = response.text();

    console.log(advice);
    return advice;
  } catch (error) {
    console.error("Error fetching financial advice:", error);
    return "Sorry, I couldn't fetch the financial advice at this moment. Please try again later.";
  }
};

export default getFinancialAdvice;