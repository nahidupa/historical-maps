## 2025-05-14 - Timeline Keyboard Accessibility
**Learning:** Timeline-based interfaces often use non-semantic elements (like `div`) for interactive points. Without explicit ARIA roles and keyboard listeners, these are invisible to screen readers and inaccessible to keyboard-only users. Using `role="tablist"` for the timeline and `role="tab"` for individual eras provides a familiar mental model for assistive technologies.
**Action:** Always ensure timeline items have `tabindex="0"`, `role="tab"`, and both click/keypress listeners to maintain accessibility.
