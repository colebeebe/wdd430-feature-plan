# F8 — Display Editorial, Verified, and General User Reviews Separately

> Implementation plan. Source: [docs/MISSING_FEATURES.md](../MISSING_FEATURES.md) §{section}.

## Metadata

| Field | Value |
|---|---|
| **Feature ID** | F8 |
| **Section** | Review Display |
| **Severity** | BLOCKER \| MAJOR \| MINOR |
| **Markets** | General Web Audience |
| **Status (today)** | MISSING |
| **Estimated effort** | S (1w) |
| **Owner (proposed)** | team |
| **Depends on** | F1, F4, F6, 7 |
| **Unblocks** | F9 |

---

## 1. Problem Statement

Users need to read reviews from different types of reviewers to make informed decisions about video games. If editorial reviews, verified reviewers' opinions, and general-user reviews are mixed together without clear distinctions, users cannot easily identify the source of each opinion or compare perspectives from different groups. This feature displays reviews on game detail pages, identifies each reviewer's account type, and allows users to view reviews grouped by category. It establishes the review presentation layer needed for users to compare opinions without combining them into a single undifferentiated list.

## 2. Goals

- Display reviews associated with the selected game on its detail page.
- Clearly distinguish editorial reviews, verified-reviewer reviews, and general-user reviews.
- Display each review's rating, written content, reviewer identity or display name, and relevant reviewer designation.
- Allow users to view reviews grouped by reviewer category.
- Make review content readable and accessible to authenticated and unauthenticated visitors.

## 3. Non-Goals

- Creating, editing, or deleting reviews; this is covered by F7.
- Calculating or displaying aggregate ratings for reviewer categories; this is covered by F9.
- Managing user roles or granting verified status; this is covered by F12.
- Moderating or deleting reviews as an administrator; this is covered by F13.
- Implementing review helpfulness voting, comments, replies, or social interactions.
- Implementing category-specific ratings such as gameplay, story, graphics, or performance.
- Sorting reviews by helpfulness, popularity, or personalized relevance.
- Adding advanced pagination, filtering, or search beyond what is necessary to retrieve and group the reviews for a game.
- Importing reviews from external websites or APIs.

## 4. Personas & User Stories

- As a visitor, I want to read reviews for a game so I can understand other people's opinions before deciding whether to play or purchase it.
- As a visitor, I want to distinguish editorial reviews from community reviews so I can evaluate the source of each opinion.
- As a visitor, I want to view verified reviewers' opinions separately so I can focus on reviews from recognized gaming personalities.
- As a general user, I want to see other users' reviews grouped by category so I can compare community opinions.
- As a verified reviewer, I want my verified designation to appear alongside my review so readers can identify my account status.
- As an editorial reviewer, I want official reviews to be clearly identified so readers can distinguish them from community submissions.

## 5. Functional Requirements

- **FR-1.** The system MUST display reviews associated with the selected game on its detail page.
- **FR-2.** The system MUST distinguish reviews into editorial, verified-reviewer, and general-user categories.
- **FR-3.** Each displayed review MUST include its rating and written review text when present.
- **FR-4.** Each displayed review MUST identify its author using the project's approved public display name or editorial identity.
- **FR-5.** Reviews authored by verified reviewers MUST display a verified designation.
- **FR-6.** Editorial reviews MUST be visibly identified as official editorial content.
- **FR-7.** The interface MUST provide a way to view or group reviews by reviewer category.
- **FR-8.** The system MUST retrieve reviews for the game currently being viewed and MUST NOT display reviews belonging to another game.
- **FR-9.** The system MUST display an appropriate empty state when a reviewer category contains no reviews.
- **FR-10.** The system MUST handle loading, API failure, and malformed response states without crashing the game detail page.
- **FR-11.** Review display MUST be available without authentication unless a separate, documented visibility rule applies.
- **FR-12.** The system MUST display only reviews permitted by the application's review visibility and moderation rules.
- **FR-13.** The system MUST display ratings consistently with the half-star increments supported by F7.
- **FR-14.** The system MUST NOT infer a user's verified status solely from client-provided review data or a user-controlled display name.
- **FR-15.** The system SHOULD display review creation or update dates where available.
- **FR-16.** The system SHOULD support bounded review retrieval so that a game with many reviews does not require the client to load every review at once.

## 6. Non-Functional Requirements

- **Performance** - Review retrieval SHOULD complete within 500 ms at the 95th percentile under the team's agreed development or test workload, excluding client-side network delays.
- **Security** - Review categories and verification badges MUST be derived from trusted server-side account data. Review text MUST be rendered safely as untrusted content. Public responses MUST NOT expose private account information.
- **Privacy & Compliance** - The interface MUST display only profile information designated for public viewing. Internal moderation notes, private account details, and session data MUST NOT be exposed.
- **Accessibility** - All new UI MUST target WCAG 2.1 AA. Reviewer categories MUST have clear labels, interactive category controls MUST be keyboard-accessible, and rating values MUST have accessible text equivalents.
- **Scalability** - Review queries MUST be scoped to the selected game and SHOULD support pagination or another bounded-results strategy.
- **Reliability** - Review retrieval failures MUST be isolated so that a failed review request does not make the core game information unavailable.
- **Observability** - Unexpected retrieval failures MUST be logged with sufficient diagnostic context without logging sensitive data.
- **Maintainability** - The implementation MUST follow the project's conventions for API responses, component structure, error handling, and role representation.
- **Internationalization** - User-facing category labels, rating descriptions, empty states, and error messages SHOULD be suitable for localization.
- **Backward compatibility** - The review display MUST use the review API and response schema established by F7. Changes to the API MUST be documented and coordinated with dependent features.

## 7. Acceptance Criteria

- **AC-1.** Given a game has reviews from all three reviewer categories, when a visitor opens its detail page, then the page displays editorial, verified-reviewer, and general-user reviews with clearly distinguishable category labels.
- **AC-2.** Given a review was written by a verified reviewer, when the review is displayed, then it includes a verified designation derived from trusted account data.
- **AC-3.** Given a review was published by an editorial reviewer, when the review is displayed, then it is clearly identified as an official editorial review.
- **AC-4.** Given a game has reviews from multiple categories, when a visitor selects a reviewer category, then the interface displays reviews belonging to that category without mixing in reviews from the other categories.
- **AC-5.** Given a game has no reviews in a particular category, when a visitor views that category, then the interface displays an appropriate empty state.
- **AC-6.** Given a game has reviews with different ratings and review text, when those reviews are displayed, then each review shows the correct rating and corresponding text.
- **AC-7.** Given a visitor opens a game's detail page, when the review data is retrieved, then only reviews associated with that game are displayed.
- **AC-8.** Given the review API returns an error, when the game detail page loads, then the page displays a review-specific error state without preventing the game information from being displayed.
- **AC-9.** Given a visitor is not logged in, when the visitor opens a game's detail page, then the visitor can read all reviews permitted by the public visibility rules.
- **AC-10.** Given review text contains HTML or script-like input, when the review is displayed, then the text is rendered safely and cannot execute unintended scripts.
- **AC-11.** Given a review's author has verified status, when the review is retrieved, then the verified designation reflects the trusted account data rather than a client-supplied badge or display name.
- **AC-12.** Given a game has more reviews than the configured retrieval limit, when the visitor browses reviews, then the API returns a bounded set and the interface provides a way to access additional results if pagination is implemented.

## 8. Data Model

- The review record MUST be associated with the correct game and author.
- The system MUST have access to the author's account category and verified status when determining how a review should be presented.
- Reviewer classification MUST use the project's authoritative role and verification data rather than user-editable profile text.
- The data model MUST support the distinction between:
  - Editorial reviewers
  - Verified reviewers
  - General users

## 9. API Surface

- `GET /api/games/:id/reviews` - Retrieve reviews associated with a specific game.

## 10. UI / UX

- **Game Detail Page** - Extend the page established by F6 with a review section.
- **Review Category Navigation** - Provide separate sections, tabs, or filters for editorial, verified-reviewer, and general-user reviews.
- **Review Card** - Display the author's public display name, reviewer designation, rating, written text, and relevant timestamps.
- **Editorial Review Indicator** - Use a clear visual label to distinguish official editorial reviews.
- **Verified Reviewer Indicator** - Display a recognizable verified designation for verified reviewers.
- **General User Indicator** - Clearly identify community reviews without implying that general users are verified reviewers.
- **Review Empty State** - Explain when no reviews are available for the selected category.
- **Loading and Error Feedback** - Provide feedback while reviews load or when retrieval fails.

## 11. AI / ML Considerations

- N/A; No AI/ML in project

## 12. Integration Points

- **User database/model** - Reuse account identity, role, display name, and verification information established by F1.
- **Game database/model** - Reuse the game model established by F4.
- **Game detail page** - Extend the UI established by F6.
- **Review API** - Retrieve reviews created and maintained by F7.
- **Authentication and authorization** - Respect the project's role and visibility rules without requiring authentication for public review browsing.

## 13. Dependencies & Sequencing

- Must ship after:
- **F1.** Set Up User Database/Model.
- **F4.** Set Up Game Database/Model.
- **F6.** Display Game Information on a Game Page.
- **F7.** Allow Users to Create, Edit, and Delete Their Own Reviews.
- Must ship before:
- **F9.** Calculate and Display Aggregate Ratings for All User Roles.

## 14. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Reviews are assigned the wrong reviewer category | M | H | Derive categories form authoritative account data |
| Verified badges are improperly displayed | M | H | Return verivied status from the server using the account's authorization verification status |

## 15. Rollout Plan

- **Feature flag:** A feature-specific flag is not required for the MVP unless the team adopts a general feature-flag mechanism.
- **Migration sequencing:** No migration is expected if F1, F4, and F7 already provide the necessary models and author information.
- **Development validation:** Seed representative editorial, verified, and general-user reviews, including games with no reviews in one or more categories.
- **Integration validation:** Confirm that the detail page retrieves the correct reviews and that the reviewer category and verified designation match authoritative account data.
- **Release criteria:** All acceptance criteria MUST pass, category grouping MUST be accurate, and review retrieval failures MUST NOT break game information display.
- **Rollback path:** Revert the review-display UI and related API changes if they introduce a blocking regression. Preserve review records created by F7.

## 16. Test Plan

- **Unit** - Test category mapping, review-card rendering, reviewer designation rendering, and empty-state behavior.
- **Integration** - Test GET /api/games/:id/reviews against the database for all three categories, empty results, nonexistent games, pagination, and visibility restrictions.
- **End-to-end** - Test review display on a game detail page, category selection, category-specific empty states, and retrieval failures. Use Playwright if selected by the team.
- **Security** - Verify that reviewer categories and verification badges cannot be forged through client data, private profile fields are not exposed, and untrusted review text cannot execute scripts.
- **Accessibility** - Test category navigation, keyboard interactions, semantic structure, accessible rating values, focus management, and screen-reader announcements.
- **Performance/load** - Measure review retrieval latency under the team's agreed workload and confirm that the endpoint retrieves only reviews for the requested game and bounded result set.
- **Manual exploratory** - Test long reviews, long author names, multiple categories, empty categories, missing display names, half-star ratings, moderated reviews, narrow viewports, and API failures.

## 17. Documentation & Training

- Document the review retrieval endpoint, category query parameter, pagination strategy, and response schema.
- Document the mapping between account roles, verified status, and displayed review categories.
- Document how review visibility and moderation affect public review display.
- Document how to seed test data for editorial, verified, and general-user reviews.
- Document how to run the relevant unit, integration, and end-to-end tests.

## 18. Open Questions

- Should the categories be presented as tabs, separate sections, or a filter control?
- Should editorial reviews appear before verified and general-user reviews, or should users choose the order?
- Should reviews be sorted by newest first, oldest first, or another default?
- What public display name should be shown if a reviewer does not have a display name configured?
- How should accounts with administrative privileges be categorized when they write reviews?
- Should the API support category filtering and pagination in the initial implementation?
- What review visibility rules should apply to reviews that are removed, hidden, or awaiting moderation?
- Should reviewer category reflect the user's current account status or the status held when the review was written?

## 19. References

- Related plans: `F1-set_up_user_database_model.md`
- Related plans: `F4-set_up_game_database_model.md`
- Related plans: `F6-display_game_information_on_a_game_page.md`
- Related plans: `F7-allow_users_to_create_edit_and_delete_their_own_reviews.md`
- Related plans: `F9-calculate_and_display_aggregate_ratings_for_all_user_roles.md`