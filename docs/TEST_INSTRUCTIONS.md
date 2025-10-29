# Specter CodeGuard AI: Hybrid Security and Optimization Copilot

**Challenge Category:** Best Hybrid AI Application: Chrome Extension
**Project ID (GCP Host):** studio-1790201751-86ac5
**Live Endpoint URL:** (PASTE THE FINAL CLOUD RUN URL HERE)

**Summary:** Specter CodeGuard AI is a privacy-first, expert-level security tool for developers. It defines the future of built-in AI by combining the instantaneous speed of **Gemini Nano** (on-device) with the deep, verifiable risk analysis of a **Specter Engine** (Cloud Run).

## 🛡️ Hybrid Architecture & Security Execution

Our solution implements a multi-layered security model that resolves the trade-off between privacy and deep analysis.

| Component | Technology | Role & Security Feature |
| :--- | :--- | :--- |
| **Client Extension** | React, Manifest V3, **Gemini Nano** | Executes instant analysis privately (data stays on device). |
| **Hybrid Gateway** | Node.js / Express (Cloud Run) | **Hardened Defenses:** Implements **Helmet** (HTTP Headers) and **Express Rate Limiting** to mitigate DoS attacks. |
| **Specter Engine** | Python, **Gemini API** | **Expert Analysis:** Performs complex security checks and returns verifiable **CVSS v3.1 Scores** and remediation steps. |
| **Security Flow** | Custom Middleware | Input is validated for length/injection patterns (**HTTP 400** defense) before reaching the core Python logic. |

## 🧠 Gemini Nano Mastery: The 6 Built-in APIs Used

Specter CodeGuard AI showcases all six Gemini Nano APIs available in Chrome to enhance the developer experience locally:

1.  **💭 Prompt API:** Used for structured security analysis of low-risk patterns and returns JSON for rapid escalation decisions.
2.  **🔤 Proofreader API:** Instantly corrects typos and grammar in code comments and documentation strings.
3.  **🖊️ Rewriter API:** Optimizes inefficient JavaScript patterns (e.g., legacy loops to modern array methods).
4.  **✏️ Writer API:** Generates function **JSDoc documentation** automatically, accelerating documentation tasks.
5.  **🌐 Translator API:** Used to quickly translate obscure API error messages or foreign-language comments.
6.  **📄 Summarizer API:** Summarizes the intended purpose of large, complex code blocks for quick understanding during code reviews.

## Installation & Next Steps

1.  Clone the repository and run `npm install` in the `client/` and `server/` directories.
2.  The Cloud Run service is already deployed and active.
3.  Please refer to **`TEST_INSTRUCTIONS.md`** to validate the full hybrid flow and security defenses.

---