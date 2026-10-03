# F7 — Allow Users to Create, Edit, and Delete Their Own Reviews

> Implementation plan. Source: [docs/MISSING_FEATURES.md](../MISSING_FEATURES.md) §{section}.

## Metadata

| Field | Value |
|---|---|
| **Feature ID** | F |
| **Section** | Reviews and Ratings |
| **Severity** | BLOCKER |
| **Markets** | General Web Audience |
| **Status (today)** | MISSING |
| **Estimated effort** | S (1w) |
| **Owner (proposed)** | team |
| **Depends on** | F1, F2, F3, F4, F6 |
| **Unblocks** | F8, F9, F13 |

---

## 1. Problem Statement

Users need a way to share their opinions about video games by submitting ratings and written reviews. Without review submission and management functionality, the platform cannot collect user-generated opinions or provide users with a way to maintain their own reviews. This feature introduces authenticated review creation, editing, and deletion, providing the foundation for displaying reviews and calculating aggregate ratings in subsequent features.

## 2. Goals

- Allow authenticated users to submit a review for a game, including a rating and written text.
- Allow users to edit and delete their own reviews.
- Validate ratings to ensure they fall between 0 and 5 stars in half-star increments.
- Associate each review with the correct game and authenticated user.
- Enforce review ownership on the server and provide clear feedback for successful and unsuccessful operations.

## 3. Non-Goals

- Displaying reviews grouped by editorial, verified, and general-user categories; this is covered by F8.
- Calculating or displaying aggregate ratings; this is covered by F9.
- Allowing administrators to moderate or delete other users' reviews; this is covered by F13.
- Implementing the game database/model, which is covered by F4.
- Implementing authentication infrastructure or registration and login; these are covered by F2 and F3.
- Adding helpfulness votes, comments, replies, or other social interactions.
- Supporting category-specific ratings such as gameplay, story, graphics, sound, or replayability.
- Implementing external review imports or automatic review generation.

## 4. Personas & User Stories

- As a registered user, I want to rate a game so I can record my opinion of it.
- As a registered user, I want to write a review so I can explain my opinion to other users.
- As a registered user, I want to edit my own review so I can correct or update my opinion.
- As a registered user, I want to delete my own review so I can remove content I no longer want published.
- As a visitor, I want to see the reviews that users have submitted so I can consider their opinions when researching a game. (Review display is handled by F8.)
- As an administrator, I want reviews to be associated with identifiable accounts so that moderation can be performed by the appropriate administrative feature.

## 5. Functional Requirements

- **FR-1.** The system MUST allow authenticated users to submit a review for an existing game.
- **FR-2.** Each review MUST contain a rating from 0 to 5 stars, allowing half-star increments.
- **FR-3.** Each review MUST be associated with the authenticated user's account and the reviewed game's identifier.
- **FR-4.** The system MUST allow a user to retrieve and edit their own review.
- **FR-5.** The system MUST allow a user to delete their own review.
- **FR-6.** The system MUST enforce review ownership on the server for edit and delete operations, regardless of any user or owner identifier supplied by the client.
- **FR-7.** The system MUST reject review submissions with missing or invalid ratings.
- **FR-8.** The system MUST reject requests that reference a nonexistent game.
- **FR-9.** The system MUST validate review text according to a documented length limit and MUST safely handle untrusted text.
- **FR-10.** The system MUST return an authentication error when an unauthenticated user attempts to create, edit, or delete a review.
- **FR-11.** The system MUST return an appropriate authorization or not-found response when a user attempts to modify another user's review, without exposing that review's private or protected details.
- **FR-12.** The system MUST provide clear success and error feedback for review creation, editing, and deletion.
- **FR-13.** The system MUST associate each review with the user's account type or role information needed by F8 to distinguish general-user, verified-reviewer, and editorial reviews.
- **FR-14.** The system MUST prevent duplicate reviews by the same user for the same game, unless the team explicitly chooses and documents a different review policy.
- **FR-15.** The system MUST make review deletion and edits visible to subsequent review retrieval and rating calculations.

## 6. Non-Functional Requirements

- **Performance** - Review create, edit, and delete requests SHOULD complete within 500 ms at the 95th percentile under the team's agreed development or test workload, excluding client-side network delays.
- **Security** - All write operations MUST require a valid server-side session. The server MUST derive the acting user's identity from the authenticated session and enforce ownership checks on every mutation. Input validation, parameterized database operations, output encoding, and appropriate CSRF protections for cookie-based sessions MUST be used.
- **Privacy & Compliance** - Review records MUST contain only the account and game information necessary for the feature. Logs MUST NOT include session identifiers, authentication secrets, or unnecessary review text.
- **Accessibility** - All new UI MUST target WCAG 2.1 AA. Rating controls MUST be keyboard-accessible and expose their values and labels to assistive technologies. Form fields MUST have programmatically associated labels and accessible validation messages.
- **Scalability** - Review queries and mutations MUST operate on the relevant game and review records rather than retrieving the entire review collection.
- **Reliability** - Failed validation or database operations MUST NOT leave partially created or inconsistently updated review records.
- **Observability** - Unexpected failures MUST be logged with sufficient diagnostic context, without logging sensitive session data.
- **Maintainability** - Review validation, authorization checks, and persistence logic MUST follow the project's agreed backend conventions.
- **Internationalization** - User-facing strings SHOULD be suitable for localization. Review text MUST support the character encoding selected for the application.
- **Backward compatibility** - The review API MUST use a consistent request, response, and error format. Database constraints MUST preserve the relationship between reviews, users, and games.

## 7. Acceptance Criteria

- **AC-1.** *Given* an authenticated user and an existing game, *when* the user submits a valid rating and review text, *then* the system stores the review associated with that user and game.
- **AC-2.** *Given* an authenticated user, *when* the user submits a rating of 0, 2.5, or 5 stars, *then* the system accepts each value as valid.
- **AC-3.** *Given* an authenticated user, *when* the user submits a rating below 0, above 5, or not in half-star increments, *then* the system rejects the request with a validation error.
- **AC-4.** *Given* an authenticated user who owns an existing review, *when* the user changes the rating or review text and submits the update, *then* the system persists the changes.
- **AC-5.** *Given* an authenticated user who owns an existing review, *when* the user confirms deletion, *then* the system deletes the review and it is no longer returned by review retrieval endpoints.
- **AC-6.** *Given* a user is not authenticated, *when* the user attempts to create, edit, or delete a review, *then* the system rejects the operation with an authentication error.
- **AC-7.** *Given* a review belongs to another user, *when* an authenticated user attempts to edit or delete it, *then* the system rejects the operation and leaves the review unchanged.
- **AC-8.** *Given* an authenticated user submits a review for a nonexistent game, *when* the request is processed, *then* the system rejects it with an appropriate client-error response.
- **AC-9.** *Given* a review contains text exceeding the documented length limit, *when* the user submits it, *then* the system rejects the request with a validation error.
- **AC-10.** *Given* a user already has a review for a game, *when* the user attempts to create a second review for the same game, *then* the system rejects the duplicate according to the documented review policy.
- **AC-11.** *Given* a user submits review text containing HTML or script-like input, *when* the review is subsequently displayed, *then* the text is handled as untrusted content and cannot execute unintended scripts.
- **AC-12.** *Given* a review is created, edited, or deleted, *when* the relevant review or rating data is retrieved afterward, *then* the result reflects the persisted change.

## 8. Data Model

- The review record is expected to contain fields equivalent to:
  - `id` - Stable review identifier.
  - `user_id` - Reference to the user who wrote the review.
  - `game_id` - Reference to the reviewed game.
  - `rating` - Numeric value from 0 to 5, allowing increments of 0.5.
  - `review_text` - User-provided review content.
  - `created_at` - Review creation timestamp.
  - `updated_at` - Timestamp of the most recent modification.

## 9. API Surface

- `POST /api/games/:id/reviews` - Create a review for the specified game.
- `GET /api/games/:id/reviews` - Retrieve reviews for a game, supporting review display in F8.
- `GET /api/reviews/:id` - Retrieve a review according to the project's access and visibility policy.
- `PUT /api/reviews/:id` - Update a review owned by the authenticated user.
- `DELETE /api/reviews/:id` - Delete a review owned by the authenticated user.

## 10. UI / UX

- **Write Review Form** - A form accessible from the relevant game page for submitting a rating and review text.
- **Rating Control** - A control that allows users to select a rating from 0 to 5 stars, including half-star increments.
- **Review Text Field** - A labeled text area for the user's written review.
- **Edit Review Interface** - Allows a user to update their own existing rating and review text.
- **Delete Review Control** - Allows a user to initiate deletion of their own review, with confirmation before the destructive action.
- **Submission Feedback** - Provides success messages and actionable validation or server-error messages.

## 11. AI / ML Considerations

- N/A; No AI/ML in project

## 12. Integration Points

- **Authentication infrastructure** - Reuse the server-side session established by F2 and the login/logout functionality from F3.
- **User database/model** - Associate reviews with users established by F1.
- **Game database/model** - Validate and associate reviews with games established by F4.
- **Game detail page** - Provide access to the review form from F6.
- **Review API** - Implement create, update, and delete operations and support retrieval for integration with F8.
- **Review display** - F8 consumes saved reviews and identifies their reviewer categories.
- **Rating aggregation** - F9 consumes saved ratings and must reflect review creation, modification, and deletion.
- **Administrative moderation** - F13 will introduce administrative review-management operations separately.

## 13. Dependencies & Sequencing

- Must ship after:
  - **F1.** Set Up User Database/Model
  - **F2.** Set Up Authentication Infrastructure
  - **F3.** Register New Users and Log In/Out
  - **F4.** Set Up Game Database/Model
  - **F6.** Display Game Information on a Game Page
- Must ship before:
  - **F8.** Display Editorial, Verified, and General-User Reviews Separately
  - **F9.** Calculate and Display Aggregate Ratings for All User Roles

## 14. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Users can modify reviews belonging to other accounts | M | H | Enforce ownership on the server for every update and delete request |
| Invalid ratings are stored | M | H | Validate ratings on the server and add database constraints |
| Concurrent submissions create duplicate reviews | M | M | Adopt an explicit duplicate-review policy and enforce it with a database constraint where only one review per use per game is allowed |

## 15. Rollout Plan

- **Feature flag:** A feature-specific flag is not required for the MVP unless the team adopts a general feature-flag mechanism.
- **Migration sequencing:** Confirm the user and game models, create the review schema if necessary, apply constraints, then implement the API and UI.
- **Development validation:** Test review creation, editing, and deletion using representative user and game records.
- **Integration validation:** Verify that reviews can be retrieved by the display feature and that ratings are available to F9.
- **Release criteria:** All acceptance criteria MUST pass, ownership enforcement MUST be verified, and invalid ratings MUST be rejected.
- **Rollback path:** Revert the feature's API and UI changes if they introduce a blocking regression. Preserve existing user and game data. If review data has been written, avoid destructive rollback migrations that would silently delete it.

## 16. Test Plan

- **Unit** — Test rating validation, review-text validation, request parsing, ownership-check logic, and response formatting.
- **Integration** — Test review creation, retrieval, update, and deletion against the database; verify foreign-key constraints, duplicate handling, session authentication, and transaction behavior where applicable.
- **End-to-end** — Test authenticated review creation, editing, and deletion; unauthenticated access; validation feedback; and behavior when the server returns an error. Use Playwright if selected by the team.
- **Security** — Test cross-account edit/delete attempts, forged owner IDs, invalid sessions, CSRF protections, SQL injection attempts, and script-like review text.
- **Accessibility** — Test keyboard navigation, accessible half-star selection, label associations, validation announcements, focus management, and delete confirmation.
- **Performance/load** — Measure review-write latency under the team's agreed test workload and confirm that operations do not retrieve unrelated review records.
- **Manual exploratory** — Test ratings at 0, 0.5, 2.5, and 5; invalid values; empty and overly long review text; repeated submissions; editing; deletion; session expiration; and navigation after successful operations.

## 17. Documentation & Training

- Document the review API routes, request and response schemas, authentication requirements, and error behavior.
- Document the rating range and half-star increments.
- Document the review-text length limit and whether text is optional.
- Document the duplicate-review policy.
- Document the ownership-enforcement rules and session-based authentication expectations.
- Document how to run review-related unit, integration, and end-to-end tests.

## 18. Open Questions

1. Can a user submit a rating without written review text, or are both required?
2. Should each user be limited to one review per game, with later submissions handled as edits?
3. What minimum and maximum review-text lengths should be enforced?
4. Should a deleted review be permanently removed or soft-deleted for administrative or audit purposes?
5. Should review edits update the original timestamp, preserve a creation timestamp, or maintain a full edit history?
6. Should review ownership violations return 403 Forbidden or 404 Not Found?
7. Should reviewer category be determined dynamically from the user's current role, or should the system preserve the category held when the review was submitted?
8. What CSRF protection and session-cookie settings will the team use for authenticated write requests?

## 19. References

- Related plans: `F1-set_up_user_database_model.md`
- Related plans: `F2-set_up_authentication_infrastructure.md`
- Related plans: `F3-register_new_users_and_log_in_out.md`
- Related plans: `F4-set_up_game_database_model.md`
- Related plans: `F6-display_game_information_on_a_game_page.md`
- Related plans: `F8-display_editorial_verified_and_general_user_reviews_separately.md`
- Related plans: `F9-calculate_and_display_aggregate_ratings_for_all_user_roles.md`
