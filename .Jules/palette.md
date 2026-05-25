## 2025-05-14 - Timeline Keyboard Accessibility
**Learning:** Timeline-based interfaces often use non-semantic elements (like `div`) for interactive points. Without explicit ARIA roles and keyboard listeners, these are invisible to screen readers and inaccessible to keyboard-only users. Using `role="tablist"` for the timeline and `role="tab"` for individual eras provides a familiar mental model for assistive technologies.
**Action:** Always ensure timeline items have `tabindex="0"`, `role="tab"`, and both click/keypress listeners to maintain accessibility.

## 2024-05-24 - Interactive Scholar Details & Map Navigation
**Learning:** In data-rich applications, transitioning from a list to a detail view within a sidebar can disorient users if not handled with clear navigation cues. Interactive elements on a map should be synchronized with the sidebar content to provide a cohesive "spatial" understanding of historical data.
**Action:** Implemented a "Back to List" button in the scholar detail view and added high-contrast `focus-visible` styles (3px box-shadow) to all interactive elements. Synchronized map markers and paths with the selected scholar to visualize their life journeys.
