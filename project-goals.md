# 🎯 Product Goals – Initial Project Context

## 🧭 Product Vision

Design and build a **personal workload visibility and arbitration tool** that makes professional missions **explicit, understandable, and arbitrable** for both the user and Product Management, without becoming a complex task manager or rigid time-tracking system.

The product must **reduce cognitive load**, **support prioritization discussions**, and **justify delivery timelines with facts**, while remaining lightweight and fast to use.

---

## 👤 Target Users

### Primary User

* A single professional user managing multiple parallel missions.
* High context switching, short deadlines, frequent priority arbitrations.
* Needs clarity, control, and reduced pressure.

### Secondary Users (indirect – MVP)

* Product Managers (main stakeholders)
* Management (secondary)
* Access via **live presentation only** (no shared access in MVP).

---

## 🎯 Core Product Goals

### PG-01 — Make workload visible and understandable

Enable the user to clearly visualize:

* current workload
* upcoming workload
* completed workload
* lack of available capacity over time

📌 The visibility must be **immediately readable** by Product Managers.

---

### PG-02 — Support factual prioritization and arbitration

Allow Product Managers to:

* understand why a mission cannot be planned earlier
* identify trade-offs between missions
* justify reprioritization or recruitment needs upstream

📌 The tool must **show constraints**, not opinions.

---

### PG-03 — Justify delivery timelines credibly

Ensure that when a delivery date is announced:

* it is supported by visible planning constraints
* no hidden availability exists unless priorities change

📌 The tool must make planning conflicts **indisputable**.

---

### PG-04 — Improve daily mission pilotage

Help the user to:

* plan missions at a weekly level
* track progress with minimal effort
* decompose missions into sub-tasks when needed
* manage both well-defined and fuzzy/exploratory work

📌 Daily usage must stay under:

* **5 minutes for planning**
* **2 minutes for tracking**

---

### PG-05 — Preserve simplicity and emotional comfort

The product must:

* avoid complexity and over-engineering
* avoid rigid or intrusive time tracking
* avoid becoming a Jira-like system

📌 The emotional outcome for the user must be:

* **apaisement**
* **motivation**

---

## 🧱 Domain Concepts (High Level)

* **Mission** (core object)

  * multiple types (feature, study, support, documentation, etc.)
  * optionally linked to a product or project
  * decomposable into sub-tasks

* **Workload**

  * expressed in hours or days
  * estimated with adjustable confidence / safety margin
  * supports both precise and fuzzy work

* **Time Views**

  * weekly (primary pilotage unit)
  * PI / 3-month horizon (for Product Management discussions)

---

## 🚫 Explicit Non-Goals

The product must NOT be:

* a full task management system
* a strict or exhaustive time tracking tool
* a reporting or HR control tool
* a complex collaboration platform

---

## ✅ MVP Success Criteria

The MVP is successful if:

* planning discussions with Product Managers are faster and clearer
* workload constraints are understood without justification effort
* the user feels more in control and less under pressure
* the tool is actually used daily due to its low friction

---

## 🔁 Evolution Constraints

* Prioritize **readability over precision**
* Favor **explicit constraints over optimization**
* Prefer **manual control over automation** in early stages
* Any new feature must reduce cognitive load, not increase it

