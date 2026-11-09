# SBU TECH Knowledge Base — Phase 1 Ingestion Audit & Review Report

**Generated:** 2026-11-09 17:56:56 UTC
**Source Document:** `SBU_TECH.pdf` (142,263 bytes)
**Document SHA-256:** `485e92e4aea4166074e86d504ca96d7123b07b86890cdb85a3755487b5e12793`
**Total Pages:** 3
**Total Chunks Produced:** 19
**Chunks Flagged for Review:** 4

---

## 1. Executive Summary

- **PDF Parsing Status:** All pages successfully read via PyMuPDF with selectable text; 0 scanned bitmap images detected.
- **Integrity:** Original PDF remains 100% untouched and unmodified.
- **Review Cautions Identified:** 6 distinct items flagged for verification.

---

## 2. Extraction & Structural Audit Findings

| Item # | Type | Page | Severity | Description | Flagged Excerpt |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `structural_gap` | Page 2 | **LOW** | Document jumps directly from '2. Owners & leadership' (Page 1) to '4. What SBU TECH does' (Page 2). Section 3 is missing in the source PDF. | `Missing Section 3` |
| 2 | `unconfirmed_caution` | Page 1 | **MEDIUM** | Document header explicitly warns that contract-specific terms must be verified before publication. | `Verify contract-specific and unconfir...` |
| 3 | `unconfirmed_caution` | Page 2 | **MEDIUM** | Document header explicitly warns that contract-specific terms must be verified before publication. | `Verify contract-specific and unconfir...` |
| 4 | `unconfirmed_caution` | Page 3 | **MEDIUM** | Document header explicitly warns that contract-specific terms must be verified before publication. | `Verify contract-specific and unconfir...` |
| 5 | `unconfirmed_caution` | Page 3 | **MEDIUM** | Document notes the live admin portal displays 'Mock Admin Mode'. Must not be presented as live production DB until confirmed. | `Mock Admin Mode` |
| 6 | `unconfirmed_caution` | Page 3 | **MEDIUM** | Certification compliance caution: SBU TECH designs for readiness, but is not certified SOC 2 / HIPAA. | `Do not claim that SBU TECH is SOC 2 o...` |

---

## 3. Actionable Verification & Editorial Guidance

### A. Structural Section Gap (Section 3)
The document contains `1. Company identity & contact details` and `2. Owners & leadership` on Page 1, then immediately jumps to `4. What SBU TECH does` on Page 2.
> **Recommendation:** Confirm with founding principals whether an intended Section 3 was omitted or if this is intentional numbering.

### B. Contract Number & Fee Hallucination Guardrail
Page 3 explicitly specifies: *'Never invent a contract number, fee, status or deadline.'*
> **AI Invariant:** The Phase 2 retrieval and Phase 4 LLM generation prompts must strictly enforce that the model never fabricates placeholder contract identifiers unless connected to an authenticated client database record.

### C. Admin System Public Status
The knowledge base highlights that the live `/admin` portal displays *'Mock Admin Mode'* with no live database connected on the public frontend.
> **Action:** Maintain transparent messaging that the admin portal is internal, until live database integration is fully active.

### D. Compliance & Certification Claims
Page 3 instructs: *'Do not claim that SBU TECH is SOC 2 or HIPAA certified based only on website references to readiness or security controls.'*
> **AI Invariant:** Answers regarding compliance should state that SBU TECH builds and architectures systems according to SOC 2 and HIPAA security readiness and controls, but does not hold independent formal third-party certification.

---

## 4. Chunks Flagged for Review

### Chunk `sbu_tech_kb_v1_p3_c015` (Page 3 — 7. Website portal & login guidance)
- **Content Type:** `portal_guide` | **Tokens:** 199
```text
7. Website portal & login guidance
Portal / action
Instructions and limitations
Client Portal
https://www.sbutech.com/login
Client login
Choose Login, enter the registered email address and password, then select Sign In as 
Client. The portal is described as providing access to a...
```

### Chunk `sbu_tech_kb_v1_p3_c016` (Page 3 — 8. Frequently asked questions)
- **Content Type:** `qa_pairs` | **Tokens:** 451
```text
8. Frequently asked questions
What is SBU TECH?
SBU TECH is a senior-led software engineering studio that designs, builds and scales web platforms, cloud infrastructure, mobile applications and private AI systems.
What services does SBU TECH provide?
Custom web applications; clou...
```

### Chunk `sbu_tech_kb_v1_p3_c017` (Page 3 — 9. Rules for the website AI assistant)
- **Content Type:** `policy_rules` | **Tokens:** 210
```text
9. Rules for the website AI assistant
• Answer from this knowledge base and approved connected records only. Do not invent owners, prices, phone numbers, contract numbers, project results or policies.
• Reply in the language used by the visitor where possible (English or Bangla)....
```

### Chunk `sbu_tech_kb_v1_p3_c019` (Page 3 — | Portal / action | Instructions and limitations |)
- **Content Type:** `tabular_data` | **Tokens:** 198
```text
| Portal / action | Instructions and limitations |
| --- | --- |
| Client Portal | https://www.sbutech.com/login |
| Client login | Choose Login, enter the registered email address and password, then select Sign In as Client. The portal is described as providing access to active ...
```
