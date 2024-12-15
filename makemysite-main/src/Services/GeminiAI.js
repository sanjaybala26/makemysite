// Assuming this is in your code file for generating content, e.g., src/generateCode.js
import { GoogleGenerativeAI } from '@google/generative-ai';

// Retrieve the API key from local storage
const storedApiKey = localStorage.getItem('API_KEY');
const genAI = new GoogleGenerativeAI(storedApiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateCode = async (prompt, history = '') => {
  try {
    // Fixed prompt with navigation requirements
    const fixedPrompt = `Please generate HTML code where navigation is handled exclusively using the \`onclick\` attribute on buttons or links. The \`navigateTo\` function should be defined in the \`<script>\` tag, and it should use \`window.location.hash\` for navigation. 
    Ensure that the function is called only through \`onclick\` attributes and no other form of navigation is included. Use window.location.hash in case of navigation dont use href because our online editor dont supports it. If the user task contains navigation then only use navigation like above. Dont give navigation unneccessarily 
    without user asking for navigation or moving to another page or going to another page OK. Again and again telling dont use navigation unnecessarily without I am asking. Give the code according to the I am provide the prompt. Dont use unnecessary navigations without I am asking.
    For example If I asks "create a button" then you just create a button not give any navigation function unwantedly. If I asks for navigation or you understand that its time for navigating a page then only you will use it. I hope do you understand. The conversation starts betweeen I and you. lets go`;

    // Combine the fixed prompt with any additional user prompt and history
    const fullPrompt = `${history}\n\nUser: ${fixedPrompt}\n\nUser Request: ${prompt}`;
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = await response.text(); // Await the text conversion

    // Extract the code from the AI's response
    let codeMatch = text.match(/```(?:html|javascript|js)?\n([\s\S]*?)```/);
    let code = codeMatch ? codeMatch[1].trim() : "// No code generated";

    return code;
  } catch (error) {
    console.error("Error generating code:", error);
    return "// Error generating code";
  }
};
