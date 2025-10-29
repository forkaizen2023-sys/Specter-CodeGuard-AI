# Specter CodeGuard AI: Hybrid Security and Optimization Copilot

**Challenge Category:** Best Hybrid AI Application: Chrome Extension

**Project Summary:** Specter CodeGuard AI is a specialized Chrome Extension designed to bring advanced security auditing and code optimization directly to the developer's workflow. It leverages a **Hybrid AI Architecture**, combining the speed and privacy of **Gemini Nano (on-device AI)** with the power and deep analysis of a **Specter Engine (Cloud Run/Gemini API)**.

**Value Proposition:**
* **Privacy-First:** Low-risk, sensitive code analysis (like grammar and refactoring) never leaves the user's device.
* **Expert Security:** High-risk code is subjected to professional-grade **CVSSv3.1 risk assessment** by our hardened backend.
* **UX Resistant to Network:** Instant feedback via Nano ensures the tool is always available and fast.

## 💻 Technical Architecture Overview

| Component | Technology | Role & Functionality |
| :--- | :--- | :--- |
| **Client Extension** | JavaScript, React, Chrome APIs | **Gemini Nano** Orchestration, UI/UX, Secure **JWT** Hybrid Connector. |
| **Hybrid Gateway** | Firebase Functions (Node.js) | Authentication, Rate Limiting, **Input Sanitization (A03:2021 Mitigation)**. |
| **Specter Engine** | Python, **Cloud Run**, Gemini API | Deep code analysis, **CVSS Score Calculation**, Execution in a **Linux Hardened Container (Non-root user)**. |

## 🚀 Gemini Nano: The 6 Built-in APIs Used

Specter CodeGuard AI demonstrates mastery of the built-in AI suite by integrating all six provided APIs for distinct security and optimization tasks:

1.  **💭 Prompt API:** Used for structured security analysis of low-risk patterns (e.g., detecting `document.write` usage) and returning a JSON object for rapid, on-device severity flagging.
2.  **🔤 Proofreader API:** Corrects grammar and typos in code comments, JSDocs, and string literals, ensuring high quality documentation.
3.  **🖊️ Rewriter API:** Suggests refactoring for inefficient code snippets (e.g., converting old callback patterns to modern `async/await`), enhancing performance locally.
4.  **✏️ Writer API:** Generates function `docstrings` or JSDoc documentation automatically based on the function body, accelerating developer documentation.
5.  **🌐 Translator API:** Used to instantly translate complex error messages from external APIs or dependency logs into the user's preferred language.
6.  **📄 Summarizer API:** Summarizes the intended purpose of large or complex code blocks, aiding code review and onboarding.

## 🛡️ Security Approach (Specter Engine)

The high-risk analysis flow demonstrates ethical hacking expertise:

* **Risk Elevation:** Suspicious code triggers an automatic call from Nano (client) to the Cloud Run backend.
* **Threat Modeling:** The Cloud Run service runs our specialized Python engine to detect advanced vulnerabilities (e.g., IDOR, RCE, Broken Access Control).
* **CVSS Scoring:** Results are delivered with a professional **CVSSv3.1 Score** and prioritized remediation steps, reflecting industry-standard risk assessment.
* **Cloud Hardening:** The backend runs in a **non-root Linux container** with strict **IAM policies** and an authenticated **JWT** gateway, mitigating OWASP Top 10 risks.

## Installation and Testing

**(Insert detailed setup instructions here, including `npm install`, `gcloud deploy` steps, and the final Chrome Extension load process.)**