# F9 — Calculate and Display Aggregate Ratings for All User Roles

> Implementation plan. Source: [docs/MISSING_FEATURES.md](../MISSING_FEATURES.md) §{section}.

## Metadata

| Field | Value |
|---|---|
| **Feature ID** | F9 |
| **Section** | Ratings and Aggregation |
| **Severity** | MINOR |
| **Markets** | General Web Audience |
| **Status (today)** | MISSING |
| **Estimated effort** | S (1w) |
| **Owner (proposed)** | team |
| **Depends on** | F4, F7, F8 |
| **Unblocks** | N/A |

---

## 1. Problem Statement

Users need a convenient way to understand how a video game is rated by different groups of reviewers before deciding whether to play or purchase it. Without aggregate ratings, users must read individual reviews and calculate an overall impression of each reviewer category themselves. This feature calculates and displays separate average ratings for editorial reviewers, verified reviewers, and general users on each game's detail page. It allows users to compare the opinions of these groups while preserving the distinction between official editorial reviews, recognized community reviewers, and the broader user community.

## 2. Goals

- Calculate an aggregate rating for each game's editorial, verified-reviewer, and general-user reviews.
- Display each category's average rating separately on the game detail page.
- Ensure that aggregate ratings reflect the current set of eligible reviews and their ratings.
- Display the number of reviews contributing to each aggregate rating.
- Handle games and reviewer categories that have no eligible ratings without displaying misleading values.

## 3. Non-Goals

- Creating, editing, or deleting reviews; this is covered by F7.
- Displaying and grouping individual reviews by reviewer category; this is covered by F8.
- Creating or editing game information; this is covered by F4 and F10.
- Managing account roles or granting and removing verified status; this is covered by F11.
- Combining all reviewer categories into a single overall rating.
- Implementing category-specific ratings such as gameplay, story, graphics, sound, performance, or replayability.
- Implementing review helpfulness voting or sorting reviews by helpfulness.
- Implementing advanced game search or filtering by aggregate rating.
- Introducing weighted averages, personalized ratings, or reputation-based scoring.
- Importing ratings from external review websites or APIs.

## 4. Personas & User Stories

- As a visitor, I want to see a game's editorial aggregate rating so I can understand the opinion of the website's editorial staff.
- As a visitor, I want to see a game's verified-reviewer aggregate rating so I can compare the opinions of recognized gaming personalities.
- As a visitor, I want to see a game's general-user aggregate rating so I can understand the broader community's opinion.
- As a general user, I want to compare ratings across reviewer categories so I can decide which perspectives are most useful to me.
- As a verified reviewer, I want my rating to contribute to the verified-reviewer aggregate so my review is represented in the appropriate category.
- As an editorial reviewer, I want my official review rating to contribute to the editorial aggregate so readers can see the overall editorial opinion.
- As an administrator, I want aggregate ratings to reflect eligible reviews accurately so that users are not misled by outdated or improperly categorized ratings.

## 5. Functional Requirements

- **FR-1.** The system MUST calculate a separate aggregate rating for editorial reviews, verified-reviewer reviews, and general-user reviews for each game.
- **FR-2.** The system MUST calculate each aggregate as the arithmetic mean of the eligible numeric ratings belonging to the corresponding reviewer category.
- **FR-3.** The system MUST support individual ratings from 0 to 5 stars in half-star increments, consistent with F7.
- **FR-4.** The system MUST determine a review's category using authoritative account role and verification data rather than client-provided category labels.
- **FR-5.** The system MUST NOT combine ratings from different reviewer categories into a single aggregate.
- **FR-6.** The system MUST display all three aggregate-rating categories on the corresponding game's detail page.
- **FR-7.** The system MUST display the number of eligible ratings contributing to each aggregate.
- **FR-8.** The system MUST handle categories with no eligible ratings by displaying an appropriate empty state, such as "No ratings yet," rather than treating the missing rating as zero.
- **FR-9.** The system MUST ensure that reviews belonging to one game do not contribute to another game's aggregate.
- **FR-10.** The system MUST ensure that creating, editing, or deleting a review updates the affected aggregate rating and review count.
- **FR-11.** The system MUST ensure that changes to review visibility or moderation status are reflected in the aggregate calculations according to the application's review eligibility rules.
- **FR-12.** The system MUST NOT include reviews that are removed, hidden, or otherwise ineligible under the application's moderation and visibility rules.
- **FR-13.** The system MUST handle a game with no reviews or no eligible ratings without producing division-by-zero errors or invalid numeric values.
- **FR-14.** The system MUST return aggregate ratings and counts in a documented, consistent API response format.
- **FR-15.** The system MUST NOT require authentication to view publicly available aggregate ratings.
- **FR-16.** The system SHOULD calculate aggregates on the server rather than relying on the client to retrieve and average every review.
- **FR-17.** The system SHOULD ensure that concurrent review changes do not leave aggregate ratings or counts inconsistent.
- **FR-18.** The system MAY round displayed averages to one decimal place, provided that calculations use the underlying rating values rather than previously rounded averages.

## 6. Non-Functional Requirements

- **Performance** - Aggregate-rating retrieval SHOULD complete within 500 ms at the 95th percentile under the team's agreed development or test workload, excluding client-side network delays. The implementation SHOULD avoid retrieving every review solely to calculate averages.
- **Security** - Aggregate ratings MUST be calculated from trusted server-side data. Client-supplied averages, review counts, reviewer categories, or verification badges MUST NOT be accepted as authoritative values.
- **Privacy & Compliance** - Aggregate responses MUST NOT expose private account information, session data, or internal moderation notes. Only information required to display aggregate ratings and counts should be returned.
- **Accessibility** - All new UI MUST target WCAG 2.1 AA. Rating values MUST have accessible text equivalents, and empty states and category labels MUST be understandable without relying solely on color or star icons.
- **Scalability** - Aggregate queries MUST be scoped to the requested game. The implementation SHOULD use database aggregation or another bounded calculation strategy rather than loading every review into application memory.
- **Reliability** - Failure to retrieve aggregate ratings MUST NOT prevent the game's core information or individual reviews from being displayed. Failed or partial calculations MUST NOT be presented as valid ratings.
- **Observability** - Unexpected aggregation failures MUST be logged with sufficient diagnostic context, including the affected game identifier where appropriate, without logging sensitive user data.
- **Maintainability** - The implementation MUST follow the project's existing database, API, error-handling, and component conventions. Aggregate calculations MUST have a clearly defined source of truth.
- **Internationalization** - User-facing category names, rating descriptions, counts, and empty-state messages SHOULD be suitable for localization.
- **Backward compatibility** - The aggregate-rating endpoint MUST remain consistent with the review model established by F7 and the review categories established by F8. API changes MUST be documented and coordinated with dependent features.

## 7. Acceptance Criteria

- **AC-1.** *Given* a game has eligible reviews from all three reviewer categories, *when* a visitor opens its detail page, *then* the page displays separate aggregate ratings for editorial reviewers, verified reviewers, and general users.
- **AC-2.** *Given* a category contains ratings of 4, 5, and 3 stars, *when* its aggregate is calculated, *then* the returned average is 4.0.
- **AC-3.** *Given* a category contains ratings of 2.5, 3.5, and 4 stars, *when* its aggregate is calculated, *then* the returned average is (3.\overline{3}), subject to the documented display-rounding rule.
- **AC-4.** *Given* a game has ratings in multiple reviewer categories, *when* its aggregates are calculated, *then* each category's average includes only eligible ratings from that category.
- **AC-5.** *Given* a game has no eligible ratings in a category, *when* its aggregate is retrieved, *then* the response indicates that no aggregate rating is available and reports a count of zero.
- **AC-6.** *Given* a review is created with a valid rating, *when* the aggregate is next retrieved, *then* the review contributes to the correct category's average and count.
- **AC-7.** *Given* an existing review's rating is edited, *when* the aggregate is next retrieved, *then* the updated rating is reflected without continuing to count the old rating.
- **AC-8.** *Given* an eligible review is deleted, *when* the aggregate is next retrieved, *then* the deleted review no longer contributes to the average or count.
- **AC-9.** *Given* a review becomes ineligible under the application's moderation rules, *when* the aggregate is next retrieved, *then* that review is excluded from the relevant aggregate.
- **AC-10.** *Given* a review is associated with a different game, *when* the current game's aggregate is calculated, *then* that review does not affect the current game's ratings or counts.
- **AC-11.** *Given* a visitor is not authenticated, *when* the visitor requests a game's aggregate ratings, *then* the publicly available aggregate values and counts are returned without requiring login.
- **AC-12.** *Given* the aggregate-rating API returns an error, *when* the game detail page loads, *then* the page displays an appropriate rating-specific error or unavailable state without preventing the game information and individual reviews from being displayed.
- **AC-13.** *Given* the server receives a review with an invalid rating outside the supported 0–5 range or not aligned to a half-star increment, *when* the review is submitted, *then* the review is rejected by the validation rules and does not affect any aggregate.
- **AC-14.** *Given* a game has multiple reviews and its aggregate is displayed, *when* the visitor compares the displayed average and count with the eligible underlying ratings, *then* both values match the documented aggregation and rounding rules.

## 8. Data Model

- The implementation MUST reuse the game and review records established by F4 and F7.
- The review model MUST provide:
  - An association with the reviewed game.
  - An association with the review's author.
  - A numeric rating supporting values from 0 to 5 in half-star increments.
  - A way to determine whether the review is eligible to contribute to an aggregate under the application's visibility and moderation rules.
- The system MUST have access to authoritative user-role and verification data when determining the category for each review.

## 9. API Surface

- `GET /api/games/:id/ratings` - Retrieve separate aggregate ratings and eligible review counts for a game.

## 10. UI / UX

- **Game Detail Page** - Extend the page established by F6 with a rating summary.
- **Editorial Aggregate Rating** - Display the editorial average and the number of eligible editorial ratings.
- **Verified Reviewer Aggregate Rating** - Display the verified-reviewer average and the number of eligible verified-reviewer ratings.
- **General-User Aggregate Rating** - Display the general-user average and the number of eligible general-user ratings.
- **Rating Display Component** - Present numeric values and, where appropriate, star icons using a consistent display format.
- **Empty State** - Display a clear message when a reviewer category has no eligible ratings.
- **Loading Feedback** - Indicate that aggregate ratings are being retrieved without unnecessarily blocking the rest of the game detail page.
- **Error Feedback** - Indicate when ratings are unavailable due to a retrieval failure without implying that the game has a zero rating.

## 11. AI / ML Considerations

- N/A; No AI/ML in project

## 12. Integration Points

- **User database/model** - Reuse account roles and verification status established by F1.
- **Game database/model** - Reuse the game records established by F4.
- **Game detail page** - Extend the UI established by F6.
- **Review creation and management** - Use review records created, edited, and deleted through F7.
- **Review display** - Keep category definitions and displayed review groupings consistent with F8.
- **Review moderation** - Respect review visibility rules established by F12.
- **Ratings API** - Implement GET /api/games/:id/ratings according to the API contract in this plan.

## 13. Dependencies & Sequencing

- Must ship after:
  - **F1.** Set Up User Database/Model.
  - **F4.** Set Up Game Database/Model.
  - **F6.** Display Game Information on a Game Page.
  - **F7.** Allow Users to Create, Edit, and Delete Their Own Reviews.
  - **F8.** Display Editorial, Verified, and General User Reviews Separately.

## 14. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Reviews are assigned to the wrong aggregate categor | M | H | Derive cateegories from authoritative account roles and verification status |
| Deleted or moderated reviews continue contributing to averages | M | H | Apply the same review elegibility rules used by the public review API |
| Empty categories are incorrectly displayed as zero-star ratings | M | M | Represent unavailable averages as `null` and display a clear empty state |

## 15. Rollout Plan

- **Feature flag:** A feature-specific flag is not required for the MVP unless the team adopts a general feature-flag mechanism.
- **Migration sequencing:** No migration is expected if F1, F4, and F7 already provide the required models and fields. If changes are needed, apply the schema migration before deploying code that depends on it.
- **Development validation:** Seed games with reviews from all three categories, including half-star ratings, multiple ratings per category, and categories with no eligible ratings.
- **Integration validation:** Confirm that review creation, editing, deletion, and moderation produce correct aggregate values and counts.
- **Release criteria:** All acceptance criteria MUST pass. Aggregate values MUST match the eligible underlying ratings, categories MUST remain separate, and rating retrieval failures MUST NOT prevent the game detail page from displaying its other information.
- **Rollback path:** Revert the aggregate-rating UI and related API changes if they introduce a blocking regression. Preserve game and review records. If aggregate values are stored, ensure rollback does not corrupt or discard review data.

## 16. Test Plan

- **Unit** - Test arithmetic averages, half-star ratings, rounding behavior, empty categories, zero counts, and category mapping.
- **Integration** - Test GET /api/games/:id/ratings against the database for all three categories, nonexistent games, empty review sets, edited ratings, deleted reviews, and moderated reviews.
- **End-to-end** - Test rating summaries on a game detail page, category labels, empty states, and API failures. Use Playwright if selected by the team.
- **Security** - Verify that public clients cannot manipulate aggregate values, forge reviewer categories, or access private user data through the ratings endpoint.
- **Accessibility** - Test semantic labels, accessible rating values, keyboard navigation where interactive controls exist, text contrast, and screen-reader interpretation.
- **Performance/load** - Measure aggregation endpoint latency under the team's agreed workload. Confirm that the implementation avoids unnecessary retrieval of every review into application memory.
- **Manual exploratory** - Test games with no reviews, reviews in only one category, half-star ratings, very large review counts, deleted reviews, moderated reviews, reviewer status changes, narrow viewports, and temporary API failures.

## 17. Documentation & Training

- Document `GET /api/games/:id/ratings`, including the response schema and error cases.
- Document the arithmetic-mean calculation, rating precision, display-rounding rules, and review eligibility rules.
- Document the mapping between account roles, verification status, and aggregate categories.
- Document how review edits, deletions, moderation, and account status changes affect aggregate values.
- Document how to seed test data and run the relevant unit, integration, and end-to-end tests.

## 18. Open Questions

1. Should aggregate averages be displayed to one decimal place, two decimal places, or another precision?
2. Should a review's category reflect the author's current account role and verification status, or the status held when the review was published?
3. Should reviews from editorial reviewers who also have verified status always count toward the editorial aggregate?
4. Should administrator-authored reviews contribute to any aggregate, and if so, which category should apply?
5. Should hidden, reported, or pending-moderation reviews be excluded immediately, or do any moderation states remain eligible?
6. Should aggregate values be calculated on demand for the MVP, or should the application store precomputed averages and counts?
7. Should the API return exact averages while the UI applies display rounding, or should the API return already-rounded values?
8. Should rating summaries update immediately after a user submits or edits a review, or is refreshing the displayed aggregate on the next request sufficient?

## 19. References

- Related plans: `F4-set_up_game_database_model.md`
- Related plans: `F6-display_game_information_on_a_game_page.md`
- Related plans: `F7-allow_users_to_create_edit_and_delete_their_own_reviews.md`
- Related plans: `F8-display_editorial_verified_and_general_user_reviews_separately.md`
