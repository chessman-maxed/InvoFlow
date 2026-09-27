# InvoFlow Design Specification (Source of Truth: Stitch "Obsidian Precision")

This document defines the exact visual and structural design system retrieved from the official Stitch project **`projects/18155462882504479863`** (Screen: *"InvoFlow — Intelligent Conversational Invoicing Workspace"*, Design System: *"Obsidian Precision"*).

---

## 1. Overall Page Structure & Tenets
- **Aesthetic Direction:** **"Obsidian Precision"** — Minimalism spliced with Precision Tech Glass. High-craft developer tooling paired with executive financial clarity.
- **Tone & Mood:** Deep graphite canvas foundation, 1px micro-borders, translucent frosted surfaces, luminous electric indigo primary accents, emerald financial status signals, and tabular monospaced numbers.
- **Zero Clutter:** No gratuitous neon gradients or heavy drop shadows. Depth is achieved via elevation steps, hairline borders (`rgba(255, 255, 255, 0.07)`), and subtle directional glows.

---

## 2. Layout & Grid System
- **Global Layout:**
  - **Fixed Top Navigation Bar:** `h-16`, frosted background (`bg-surface/90 backdrop-blur-xl`), `border-b border-outline-variant/20`.
  - **Fixed Left Sidebar (Stream & Lineage Navigation):** `w-64`, `top-16`, frosted container with links for *Workspace Flow*, *Invoice Lineage*, *Rate Catalog*, *Revenue Insights*, and telemetry meter (*Vector Memory* & Sync health).
  - **Main Content Area:** Offset by `pl-64` on desktop, containing a top hero/eyebrow section and a responsive two-column split workspace.
- **Workspace Split (12-column grid):**
  - **Left Column (5 columns):** Client Conversation Stream, LLM Understanding & Entity Extraction chips, Stateful Changes Diff Ledger, and Smart Budget Intelligence Assistant.
  - **Right Column (7 columns):** Live Invoice Draft Bar, the Physical Invoice Artifact card, Payment & Totals breakdown, and the Human-in-the-Loop Approval & Dispatch Bar.
- **Responsive Behavior:**
  - **Desktop (1280px+):** 12-column grid, 2rem margins, 1.5rem gutters, persistent split-view.
  - **Tablet (768px - 1279px):** Sidebar collapses or transforms into a command sheet; workspace adapts to single or stacked layout.
  - **Mobile (< 768px):** 4-column fluid grid, 1rem margin, 0.75rem gutter. Stacked single column with conversation panel on top and invoice below.

---

## 3. Color Palette (Obsidian Precision)

### Core Canvas & Surfaces
| Token Name | Hex / Value | Description |
| :--- | :--- | :--- |
| `surface-container-lowest` | `#0e0e10` / `#0a0a0c` | Deepest base canvas background |
| `surface` / `surface-dim` | `#131315` | Default dark surface ground |
| `surface-container-low` | `#1c1b1d` | Card containers, panels, and toolbars |
| `surface-container` | `#201f21` | Inner cards, table headers, chat bubbles |
| `surface-container-high` | `#2a2a2c` | Interactive elevated buttons, active tab states |
| `surface-container-highest`| `#353437` | Hover overlays and borders |
| `surface-bright` | `#39393b` | High contrast elements |

### Text Tokens
| Token Name | Hex | Description |
| :--- | :--- | :--- |
| `on-surface` | `#e5e1e4` / `#f3f4f6` | High-contrast primary headings and text |
| `on-surface-variant` | `#c7c4d7` / `#9ca3af` | Secondary labels, descriptions, and subtitle copy |
| `outline` | `#908fa0` | Subdued metadata, timestamps, and placeholders |
| `outline-variant` | `#464554` | 1px hairline borders (`rgba(255, 255, 255, 0.07)`) |

### Brand Accents & State Colors
| Token Name | Hex | Usage |
| :--- | :--- | :--- |
| `primary` (Electric Indigo) | `#6366f1` / `#c0c1ff` | Primary CTA, focus borders, invoice title, brand accents |
| `primary-container` | `#8083ff` | Hover states and primary active highlights |
| `on-primary` | `#1000a9` / `#ffffff` | Text on primary buttons |
| `secondary` (Precision Emerald)| `#10b981` / `#4edea3` | AI pulse indicators, budget healthy status, positive diffs (`+ Added`) |
| `tertiary` (Luminous Violet)| `#818cf8` / `#bdc2ff` | AI entity extraction tags, suggestions |
| `error` | `#ffb4ab` / `#ef4444` | Budget exceeded alert, removed items (`− Removed`) |

---

## 4. Typography

Leverages a dedicated three-tier typographic engine:
1. **Display & Headlines:** `Plus Jakarta Sans`
   - `display`: `3.5rem` (56px), bold (`700`), leading `4rem`, tracking `-0.035em`
   - `headline-lg`: `2.25rem` (36px), semibold (`600`), leading `2.75rem`, tracking `-0.025em`
   - `headline-md`: `1.5rem` (24px), semibold (`600`), leading `2rem`, tracking `-0.02em`
   - `headline-sm`: `1.125rem` (18px), semibold (`600`), leading `1.5rem`, tracking `-0.015em`
2. **Body & Dialogue:** `Inter`
   - `body-lg`: `1.0625rem` (17px), regular (`400`), leading `1.75rem`
   - `body-md`: `0.875rem` (14px), regular (`400`), leading `1.5rem`
   - `body-sm`: `0.75rem` (12px), regular (`400`), leading `1.25rem`
3. **Financials, Badges & Code Metadata:** `JetBrains Mono`
   - `financial-numeric`: `1.25rem` (20px), semibold/bold (`600`/`700`), tabular numerals (`tabular-nums`), tracking `-0.03em`
   - `label-md`: `0.8125rem` (13px), medium (`500`), leading `1.25rem`
   - `label-sm`: `0.6875rem` (11px), medium (`500`), leading `1rem`, tracking `0.02em`

---

## 5. Spacing & Shape Tokens
- **Spacing Units:**
  - `space-xs`: `0.25rem` (4px)
  - `space-sm`: `0.5rem` (8px)
  - `space-md`: `1rem` (16px)
  - `space-lg`: `1.5rem` (24px)
  - `space-xl`: `2.5rem` (40px)
  - `gutter`: `1.5rem` (24px), mobile gutter: `0.75rem` (12px)
  - `margin`: `2rem` (32px), mobile margin: `1rem` (16px)
- **Border Radius (`rounded`):**
  - Buttons, inputs, chips: `rounded-lg` (6px to 8px) or `rounded-xl` (12px)
  - Cards, panels, invoice sheet: `rounded-2xl` (16px)
  - Status badges, pulse pills: `rounded-full` (9999px)
- **Borders & Dividers:**
  - Hairline 1px solid dividers using `rgba(255, 255, 255, 0.07)` or `border-outline-variant/20`.
  - Focus borders: `rgba(99, 102, 241, 0.45)`.

---

## 6. Component Specifications

### A. Navigation & Telemetry
- **Header:** Brand icon + wordmark, version badge (`v1.4 AI Core`), horizontal navigation tabs (`Workspace`, `Stateful Engine`, `Rate Catalog`, `Intelligence`), active AI Engine latency pill (`AI Engine Active (24ms)`), currency lock indicator (`CURR: INR (₹)`), quick command helper (`[ ⌘ K ]`), and user profile avatar.
- **Sidebar:** Navigation icons (`terminal`, `timeline`, `table_chart`, `monitoring`, `verified`), live sync status, and system memory indicator (`Vector Memory: 98.4%`).

### B. Client Conversation Panel (Left)
- **Header & Telemetry:** Card title *"Client Conversation"* with sparkles icon, turns counter (`3 turns parsed`), and character counter.
- **Platform Filter Pills:** Horizontal pill list for WhatsApp Chat, Email Thread, Slack / DM, Audio Transcript.
- **Conversation Thread View:** Distinct turn bubbles with sender identity, timestamp, and message text (e.g. Turn #1 request, Turn #2 revisions, Turn #3 budget limits).
- **Quick Test Simulation Chips:** One-click simulation triggers (e.g. `+ Simulate: "Add 1 Brand Guide"`, `+ Simulate: "Exceed ₹10k cap"`).
- **Re-analyze Button:** Full-width electric indigo button with sync icon and `⌘ Enter` shortcut tag.
- **Zero Data Retention Badge:** Bottom reassurance banner with shield icon.

### C. Stateful Intelligence & Diff Ledger
- **Entity Extraction Card:** Real-time breakdown of extracted entities (e.g. `5 × Social Media Carousel Post`, `1 × Logo Design Refresh [EXCLUDED]`, `Client Budget Detected: ₹10,000`).
- **Stateful Changes Ledger:** Visual diff tracking additions and removals with turn attribution:
  - `+ Added 2 × Social Posts` (Turn #2 • qty: 3 → 5)
  - `− Removed Logo Refresh` (Turn #2 • "scratch the logo")
  - Agent reasoning explanation trace.

### D. Smart Budget Intelligence Assistant
- **Three-Metric Matrix:**
  1. `Invoice Total` (e.g. ₹4,000)
  2. `Client Budget` (e.g. ₹10,000)
  3. `Headroom Left` / `Budget Overrun` (+₹6,000 or -₹X)
- **Status Pills:** `Healthy (40% Utilized)` in emerald, or `OVER BUDGET (Alert)` in error red.
- **Upsell / Remediation Advisory:** Intelligent recommendation box with clickable upsell chips when headroom remains.

### E. Live Invoice Artifact Card (Right)
- **Invoice Card:** Floating dark glass/card container (`rounded-2xl`, `bg-surface-container`, `shadow-xl`) with watermark hash stamp.
- **Header Section:** Studio Mono freelancer identity, Bengaluru address, GSTIN, and prominent `INVOICE` title with invoice number, issue date, and Net 7 terms.
- **Billed To & Scope Strip:** Two-column card section displaying client details (Sarah Chen / Acme Cloud) and project scope title.
- **Line Items Table:**
  - 12-column header (`Item & Description`, `Qty`, `Unit Rate`, `Amount (₹)`).
  - Interactive rows with `+`/`-` quantity steppers, strike-through for excluded items, and tabular numeric prices.
- **Totals & Payment Details:**
  - Left column: UPI ID (`alex@okaxis`), Bank account, IFSC, dynamic generation footnote.
  - Right column: Subtotal, Tax/GST exemption, Discount, and grand `Total Due` in large display type (`text-headline-lg font-bold text-primary font-mono`).

### F. Human-in-the-Loop Approval & Dispatch Bar
- **Progress Stepper:** `1. Conversation → 2. Extracted → 3. Review & Sign-off → 4. Dispatch`.
- **Policy Notice:** *"Human Approval Enforced: No automated client sends."*
- **Primary Actions:**
  - Primary button (2/3 width): `Approve & Download PDF` (Electric Indigo with verified check icon).
  - Secondary button (1/3 width): `Send via WhatsApp` (Emerald send icon).
- **Confirmation Toast:** Animated dismissible banner on successful approval.

---

## 7. Interactive Simulation Scenarios in Stitch
The Stitch design features 4 simulation presets:
1. **Scenario 1 (Initial Request):** 3 Posts + Logo = ₹7,400.
2. **Scenario 2 (Client Revision):** +2 Posts, Remove Logo = ₹4,000.
3. **Scenario 3 (Budget Alert):** Exceeds ₹10k cap with alert state.
4. **Scenario 4 (Empty Canvas):** Clean state ready for fresh conversation input.
