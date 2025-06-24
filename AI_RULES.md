# AI Development Rules for Justicaa

This document outlines the core technologies used in the Justicaa application and provides clear guidelines for their usage. Adhering to these rules ensures consistency, maintainability, and optimal performance.

## 🚀 Tech Stack Overview

*   **Frontend Framework**: React with Vite for fast development.
*   **Language**: TypeScript for robust, type-safe code.
*   **Styling**: Tailwind CSS for utility-first styling.
*   **UI Components**: Shadcn/ui for pre-built, accessible UI components.
*   **Backend & Database**: Supabase for authentication, real-time database, and serverless Edge Functions.
*   **AI Engine**: OpenAI (GPT models) and Google Gemini (Gemini-1.5-Flash) via Supabase Edge Functions for AI chat and legal intelligence.
*   **Routing**: React Router for client-side navigation.
*   **State Management**: React Query for server-state management and data fetching.
*   **Animations**: Framer Motion for smooth, declarative UI animations.
*   **Icons**: Lucide React for a consistent icon set.
*   **Internationalization**: i18next for multi-language support.
*   **PDF Generation**: jsPDF for client-side PDF document creation.
*   **Word Document Generation**: html-docx-js for client-side Word document creation.
*   **Toast Notifications**: Sonner and `@/components/ui/use-toast` for user feedback.

## 📚 Library Usage Guidelines

To maintain a clean and efficient codebase, please follow these rules when implementing new features or modifying existing ones:

1.  **React & TypeScript**:
    *   All new components and logic should be written in TypeScript (`.tsx` or `.ts` files).
    *   Always create new files for new components or hooks, even small ones. Avoid adding new components to existing files.
    *   Aim for components that are 100 lines of code or less. Refactor larger components into smaller, focused ones.

2.  **Tailwind CSS**:
    *   **Exclusive Styling**: Use Tailwind CSS classes for all styling. Avoid custom CSS files or inline styles unless absolutely necessary for dynamic values.
    *   **Responsive Design**: Always prioritize responsive design using Tailwind's utility-first approach (e.g., `md:`, `lg:` prefixes).

3.  **Shadcn/ui**:
    *   **Component Library**: Utilize Shadcn/ui components for common UI elements (buttons, cards, forms, dialogs, etc.).
    *   **No Direct Modification**: Do NOT modify the files within `src/components/ui/`. If a Shadcn component needs customization beyond its props, create a new component that wraps or extends it.

4.  **React Router**:
    *   **Centralized Routes**: All application routes should be defined and managed within `src/App.tsx`.
    *   **Navigation**: Use `Link` components for internal navigation and `useNavigate` hook for programmatic navigation.

5.  **Supabase**:
    *   **Data Operations**: Use the `supabase` client (imported from `src/integrations/supabase/client.ts`) for all database interactions (fetching, inserting, updating, deleting data).
    *   **Authentication**: Handle user authentication (sign-up, sign-in, sign-out, password reset) exclusively through the `useAuth` hook.
    *   **Serverless Logic**: For backend logic, use Supabase Edge Functions (e.g., `supabase/functions/ai-legal-chat-hf/index.ts`).

6.  **AI Integration (Supabase Edge Functions)**:
    *   **AI Models**: The `ai-legal-chat-hf` function uses Google Gemini for legal chat. The `ai-legal-chat` function uses OpenAI GPT. Ensure the correct function is invoked for the intended AI interaction.
    *   **Prompts**: Maintain and refine system prompts within the Edge Functions to ensure accurate and legally relevant AI responses.

7.  **Lucide React**:
    *   **Icons**: Use icons from the `lucide-react` library for all visual representations. Import them directly (e.g., `import { Scale } from 'lucide-react';`).

8.  **React Query**:
    *   **Data Fetching**: Use React Query for managing asynchronous data (e.g., fetching user data, conversations, documents from Supabase). This helps with caching, loading states, and error handling.

9.  **Framer Motion**:
    *   **Animations**: Apply `framer-motion` for all interactive and decorative animations to ensure a consistent and performant animation experience.

10. **i18next**:
    *   **Translations**: Use the `useTranslation` hook for all text content that needs to be localized. Ensure new strings are added to the appropriate `locales` JSON files.

11. **Document Generation Libraries**:
    *   **PDF**: Use `jspdf` for generating PDF documents on the client-side.
    *   **Word (DOCX)**: Use `html-docx-js` for generating Word documents on the client-side.

12. **Toast Notifications**:
    *   **User Feedback**: Use the `useToast` hook (from `@/hooks/use-toast.ts`) for all temporary, non-intrusive user notifications (e.g., success messages, errors, warnings).

By following these guidelines, we can ensure that Justicaa remains a high-quality, maintainable, and scalable application.