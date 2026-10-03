# F12 — Moderate/Delete User Reviews as an Administrator

> Implementation plan. Source: [docs/MISSING_FEATURES.md](../MISSING_FEATURES.md) §{section}.

## Metadata

| Field | Value |
|---|---|
| **Feature ID** | F12 |
| **Section** | Basic Administration |
| **Severity** | MAJOR |
| **Markets** | General Web Audience |
| **Status (today)** | MISSING |
| **Estimated effort** | S (1w) |
| **Owner (proposed)** | team |
| **Depends on** | F1, F3, F4, F7, F8, F9, F11 |
| **Unblocks** | N/A |

---

## 1. Problem Statement

The platform allows users, verified reviewers, and editorial reviewers to publish reviews and ratings for video games. Without administrative moderation tools, administrators cannot remove inappropriate, abusive, spam, or otherwise policy-violating user-generated reviews, limiting their ability to maintain a useful and trustworthy review platform. This feature provides an administrator-only workflow for viewing reviews, inspecting their context, and removing reviews when necessary while preserving authorization boundaries and maintaining consistency in displayed reviews and aggregate ratings.

## 2. Goals

- Allow administrators to view reviews submitted to the platform and identify content requiring moderation.
- Allow administrators to inspect review content, author information, associated game information, and rating details before taking action.
- Allow administrators to delete reviews that violate the platform's moderation rules.
- Ensure that only authorized administrators can perform moderation operations.
- Ensure that deleted reviews no longer appear in public review listings or contribute to aggregate ratings.

## 3. Non-Goals

- Implementing user registration, login, logout, or authentication infrastructure; these are covered by F2 and F3.
- Creating the user or game database models; these are covered by F1 and F4.
- Implementing ordinary review creation, editing, and deletion by review authors; this is covered by F7.
- Implementing the public review display or grouping reviews by reviewer type; this is covered by F8.
- Implementing rating aggregation; this is covered by F9.
- Managing user roles or reviewer verification; this is covered by F11.
- Creating or editing games; this is covered by F10.
- Implementing a user reporting system, automated content moderation, AI-based abuse detection, or moderation queues driven by user reports.
- Implementing review appeals, reinstatement workflows, or a full moderation-history dashboard.

## 4. Personas & User Stories

- As an administrator, I want to view reviews across the platform so that I can identify content that requires moderation.
- As an administrator, I want to inspect a review's content, rating, author, and associated game so that I can make an informed moderation decision.
- As an administrator, I want to delete a review that violates platform rules so that inappropriate content is no longer publicly displayed.
- As an administrator, I want to receive confirmation when a review has been removed so that I know the moderation action succeeded.
- As a general user, I want inappropriate reviews to be removable so that the platform remains useful and welcoming.

## 5. Functional Requirements

- **FR-1.** The system MUST provide an administrative interface for viewing reviews that may require moderation.
- **FR-2.** The system MUST restrict administrative moderation interfaces and protected moderation endpoints to authenticated administrators.
- **FR-3.** The server MUST independently verify administrator authorization for every moderation operation.
- **FR-4.** The system MUST retrieve review information from the existing review model established by F7.
- **FR-5.** The system MUST allow administrators to inspect a review's text, rating, author, associated game, reviewer classification where available, and relevant timestamps where available.
- **FR-6.** The system MUST provide a mechanism for an administrator to delete a selected review.
- **FR-7.** The system MUST require the target review to exist before attempting deletion and MUST return an appropriate not-found response if it does not exist.
- **FR-8.** The system MUST prevent unauthenticated users and non-administrator accounts from deleting reviews through administrative moderation endpoints.
- **FR-9.** The system MUST allow administrators to moderate reviews regardless of whether the author is a general user or a verified reviewer.
- **FR-10.** The system MUST define how editorial reviews are handled by moderation operations and MUST prevent ordinary user-review moderation controls from accidentally deleting editorial content.
- **FR-11.** After a review is successfully deleted, the system MUST exclude it from public review listings and individual game-page review displays.
- **FR-12.** After a review is successfully deleted, the system MUST ensure that the deleted review no longer contributes to any affected aggregate rating.
- **FR-13.** The system MUST preserve unrelated reviews and their ratings when a review is deleted.
- **FR-14.** The system MUST ensure that a failed deletion does not leave the review partially deleted or the associated rating data inconsistent.
- **FR-15.** The system MUST provide clear success or failure feedback after a moderation attempt.

## 6. Non-Functional Requirements

- **Performance** - Review-list and review-detail requests SHOULD complete within 500 ms at the 95th percentile under the team's agreed test workload. Review deletion SHOULD complete within 500 ms at the 95th percentile under normal development conditions, excluding exceptional database or infrastructure failures. The interface SHOULD avoid loading unrelated review text or account data unnecessarily.
- **Security** - All administrative moderation endpoints MUST require authentication and server-side administrator authorization. The server MUST validate target review identifiers and enforce authorization independently of the client UI. The implementation MUST guard against insecure direct object references, privilege escalation, and unauthorized deletion through manipulated requests. Review content MUST be handled as untrusted user-generated input, with appropriate output encoding to prevent cross-site scripting.
- **Privacy & Compliance** - The moderation interface MUST display only information reasonably needed to evaluate and manage reviews. Private account information MUST NOT be exposed through public review endpoints. Moderation logs, if implemented, MUST avoid recording authentication secrets or unnecessary personal information.
- **Accessibility** - All new UI MUST target WCAG 2.1 AA. Review lists, action buttons, confirmation dialogs, loading indicators, and status messages MUST be keyboard-accessible and usable with assistive technologies. Focus MUST be managed appropriately when a review is deleted or a confirmation dialog closes.
- **Scalability** - The review-list endpoint SHOULD avoid retrieving the entire review table without limits. If the dataset grows beyond a reasonable single-page result set, pagination SHOULD be implemented. Search and filtering MAY be added if required to keep moderation manageable.
- **Reliability** - Review deletion MUST be persisted before the interface reports success. Database failures MUST NOT leave inconsistent review records or rating calculations. Where deletion and rating updates require multiple database operations, the implementation MUST use a transaction or another consistency-preserving approach appropriate to the existing architecture.
- **Observability** - Unexpected moderation failures SHOULD be logged with diagnostic context. If moderation audit logging exists, successful deletions SHOULD record the acting administrator, target review identifier, timestamp, and outcome. Logs MUST NOT contain passwords, authentication tokens, or unnecessary copies of review content.
- **Maintainability** - The implementation MUST follow existing route, controller, validation, database-access, authorization, and error-handling conventions. Review deletion MUST reuse the existing review model and rating aggregation behavior rather than introduce a separate moderation-specific review store.
- **Internationalization** - User-facing labels, confirmation prompts, empty states, and error messages SHOULD be prepared for localization.
- **Backward compatibility** - The feature MUST remain compatible with existing review creation, editing, display, and aggregate-rating functionality. Any database changes MUST follow the repository's migration conventions and MUST preserve unrelated user and review records.

## 7. Acceptance Criteria

- **AC-1.** *Given* an authenticated administrator, *when* the administrator opens the moderation interface, *then* the system displays reviews and sufficient contextual information to identify their authors and associated games.
- **AC-2.** *Given* an unauthenticated visitor, *when* the visitor requests an administrative moderation endpoint, *then* the server rejects the request without exposing protected moderation data.
- **AC-3.** *Given* an authenticated general user, *when* that user attempts to use an administrative moderation endpoint, *then* the server rejects the request without deleting or modifying any review.
- **AC-4.** *Given* an authenticated verified reviewer, *when* that reviewer attempts to use an administrative moderation endpoint, *then* the server rejects the request unless the account also has administrator privileges.
- **AC-5.** *Given* an administrator viewing a review, *when* the administrator selects the delete action, *then* the interface requests confirmation before proceeding, if confirmation is implemented as required by the UI design.
- **AC-6.** *Given* an administrator confirms deletion of an existing user review, *when* the server successfully processes the request, *then* the review is removed from the active review dataset and the interface confirms the successful operation.
- **AC-7.** *Given* a deleted review, *when* a user opens the associated game's review list, *then* the deleted review is no longer displayed.
- **AC-8.** *Given* a deleted review, *when* the associated game's aggregate ratings are retrieved or recalculated, *then* the deleted review is not included in any applicable reviewer-group aggregate.
- **AC-9.** *Given* a review does not exist, *when* an administrator attempts to delete it, *then* the server returns the established not-found response and does not modify unrelated records.
- **AC-10.** *Given* a review deletion fails because of a database or server error, *when* the interface receives the failure response, *then* it displays an error and does not falsely report that the review was deleted.
- **AC-11.** *Given* an administrator deletes one review, *when* the associated game has other reviews, *then* those other reviews remain unchanged and visible according to their normal access rules.
- **AC-12.** *Given* an administrator deletes a review, *when* the deletion completes, *then* the author's account and other reviews remain intact.
- **AC-13.** *Given* an administrator attempts to delete an editorial review through the user-review moderation interface, *when* the server processes the request, *then* the system follows the defined editorial-review policy and prevents accidental deletion through an inappropriate operation.
- **AC-14.** *Given* a non-administrator submits a direct HTTP request to the review-deletion endpoint, *when* the server processes the request, *then* it rejects the request regardless of whether the client displays moderation controls.

## 8. Data Model

- The implementation MUST reuse the existing review model established by F7.
- Each review MUST retain its existing relationship to its author and associated game.
- Review deletion MUST use the existing database-access and integrity conventions.
- The implementation MUST preserve the relationship between reviews and the reviewer classifications used by F8 and the aggregate calculations used by F9.

## 9. API Surface

- `GET /api/games/:id/reviews` - Retrieve reviews for a game.
- `POST /api/games/:id/reviews` - Create a review.
- `GET /api/reviews/:id` - Retrieve a review.
- `PUT /api/reviews/:id` - Update a review.
- `DELETE /api/reviews/:id` - Delete a review.

## 10. UI / UX

- **Administrative Moderation Interface** - Provide an administrator-only page or view for listing reviews across the platform.
- **Review Detail and Deletion** - Present the selected review's content and contextual information before deletion.

## 11. AI / ML Considerations

- N/A; No AI/ML in project

## 12. Integration Points

- **Review model and data access** - Reuse the review model and CRUD behavior established by F7.
- **Authentication infrastructure** - Use the authentication mechanisms established by F2 and F3.
- **User model and role management** - Reuse the user and administrator-role definitions from F1 and F11.
- **Game model** - Use the game relationship established by F4 to display the title and context associated with each review.
- **Public review displays** - Integrate with F8 so that deleted reviews disappear from the relevant reviewer-type groups.
- **Rating aggregation** - Integrate with F9 so that deleted reviews no longer contribute to the appropriate aggregate.

## 13. Dependencies & Sequencing

Must ship after:
- **F1.** Set Up User Database/Model - Needed to identify review authors and their account classifications.
- **F2.** Set Up Authentication Infrastructure - Needed to authenticate moderation requests.
- **F3.** Register New Users and Log In/Out - Needed for the existing authenticated-user workflows.
- **F4.** Set Up Game Database/Model - Needed to identify the game associated with each review.
- **F7.** Allow Users to Create, Edit, and Delete Their Own Reviews - Needed for the existing review data model and deletion behavior.
- **F8.** Display Editorial, Verified, and General-User Reviews Separately - Needed to verify that deleted reviews are removed from the correct public review groups.
- **F9.** Calculate and Display Aggregate Ratings - Needed to ensure deleted reviews are excluded from aggregate ratings.
- **F11.** View a List of Users and Edit Roles as an Administrator - Needed for the existing administrator role definitions and authorization conventions, if F11 establishes shared middleware or UI patterns.

## 14. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Non-administrators delete other users' reviews | M | H | Enforce server-side authorization |
| Deleted reviews remain visible in public lists | M | H | Test all review-list queries and ensure deletion state is consistently filtered |
| Database deletion affects unrelated records | L | H | Verify foreign-key behavior and use appropriate transactions |

## 15. Rollout Plan

- **Feature flag:** A dedicated feature flag is not required for the MVP unless the project already uses feature flags.
- **Migration sequencing:** No migration is expected if the existing review model already supports deletion. If soft deletion requires a schema change, apply the migration before deploying code that depends on it.
- **Development validation:** Seed test data containing reviews from general users, verified reviewers, and editorial reviewers.
- **Authorization validation:** Test moderation endpoints using an administrator, editorial reviewer without administrator privileges, verified reviewer, general user, and unauthenticated requester.
- **Data integrity validation:** Confirm that deleting a review preserves the author's account, the associated game, and unrelated reviews.
- **Aggregate validation:** Confirm that the appropriate aggregate rating changes after deleting a review and that unrelated rating groups remain correct.
- **Security validation:** Test direct API requests, invalid review identifiers, repeated deletion attempts, and script-like review content.
- **Release criteria:** All acceptance criteria MUST pass, unauthorized deletions MUST be rejected, deleted reviews MUST disappear from public displays, and affected aggregate ratings MUST remain consistent.
- **Rollback path:** Revert the moderation UI and API changes if they cause a blocking regression. If hard deletion is used, recognize that deleted review content may not be recoverable without a backup. If soft deletion is used, restoration MUST follow the project's documented policy. Do not roll back by deleting unrelated review or account data.

## 16. Test Plan

- **Unit** - Test administrator authorization, review-deletion logic, review serialization, deletion-state filtering, and rating-aggregation integration points.
- **Integration** - Test review deletion against the database, including existing reviews, nonexistent identifiers, repeated deletion, foreign-key integrity, and database failures.
- **End-to-end** - Test an administrator viewing reviews, inspecting review details, confirming deletion, and verifying that the review disappears from the moderation list and public game page. Use Playwright if selected by the team.
- **Security** - Test unauthenticated requests, all non-administrator roles, direct HTTP deletion requests, manipulated identifiers, unauthorized review-field changes, and attempts to delete editorial reviews through the wrong operation.
- **Accessibility** - Test keyboard navigation, focus handling in confirmation dialogs, accessible status messages, semantic structure, and screen-reader compatibility. Use automated accessibility checks where available.
- **Performance/load** - Measure review-list and deletion latency under the agreed test workload. Confirm that the API avoids unnecessarily loading the entire review dataset.
- **Manual exploratory** - Test empty lists, long review text, special characters, HTML-like content, failed network requests, repeated deletion attempts, missing game details, reviewer classification changes, and aggregate updates after deletion.

## 17. Documentation & Training

- Document the administrative moderation workflow and its supported operations.
- Document the distinction between user-authorized deletion of one's own review and administrator moderation of another user's review.
- Document how deleted reviews are handled in the database, including whether deletion is permanent or reversible.
- Document the effect of deletion on public review lists and aggregate ratings.
- Document the API routes, authorization requirements, response shapes, and error behavior.
- Document any audit-logging behavior and how moderation failures are investigated.
- Document how to run moderation-related unit, integration, security, and end-to-end tests.

## 18. Open Questions

1. Should moderation use hard deletion or soft deletion?
2. Should administrators be able to delete editorial reviews, or should editorial reviews require a separate administrative workflow?
3. Does the existing review model distinguish editorial reviews from user-generated reviews using a role, a review type, or a separate data model?
4. Should the moderation interface list every review by default, or should it require a game, author, or reviewer-type filter?
5. Does the existing API already provide a way for administrators to retrieve reviews across all games?
6. Should the system maintain an audit log of moderation actions, including the administrator, review identifier, timestamp, and reason?
7. Should administrators be required to provide a reason when deleting a review?
8. Should users receive a notification when their review is removed?

## 19. References

- Related plans: `F1-set_up_user_database_model.md`
- Related plans: `F2-set_up_authentication_infrastructure.md`
- Related plans: `F3-register_new_users_and_log_in_out.md`
- Related plans: `F4-set_up_game_database_model.md`
- Related plans: `F7-allow_users_to_create_edit_delete_their_own_reviews.md`
- Related plans: `F8-display_editorial_verified_and_general_user_reviews_separately.md`
- Related plans: `F9-calculate_and_display_aggregate_ratings.md`
- Related plans: `F11-view_users_and_edit_roles_as_an_administrator.md`
