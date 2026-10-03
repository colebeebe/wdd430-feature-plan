# F10 — Create, Edit, and Delete Games as an Administrator

> Implementation plan. Source: [docs/MISSING_FEATURES.md](../MISSING_FEATURES.md) §{section}.

## Metadata

| Field | Value |
|---|---|
| **Feature ID** | F10 |
| **Section** | Basic Administration |
| **Severity** | MAJOR |
| **Markets** | General Web Audience |
| **Status (today)** | MISSING |
| **Estimated effort** | S (1w) |
| **Owner (proposed)** | team |
| **Depends on** | F3, F4 |
| **Unblocks** | N/A |

---

## 1. Problem Statement

The application requires an authoritative game database that administrators can maintain as the catalog grows and game information changes. Without administrative game management, incorrect or outdated information cannot be corrected through the application's interface, and new games cannot be added or removed through controlled workflows. This feature provides administrator-only functionality to create, edit, and delete game records while protecting the integrity of the game database and ensuring that changes are reflected in the public game catalog and game detail pages.

## 2. Goals

- Allow authorized administrators to create game records with the required game information.
- Allow authorized administrators to edit existing game information.
- Allow authorized administrators to delete game records according to the application's deletion rules.
- Validate game data on the server before creating or updating records.
- Ensure that game-management operations are restricted to administrators and that successful changes are reflected in the public application.

## 3. Non-Goals

- Building the general game browsing and search experience; this is covered by F5.
- Building the public game detail page; this is covered by F6.
- Creating the game database model; this is covered by F4.
- Managing user accounts, account roles, or verified-reviewer status; this is covered by F11.
- Creating, editing, or deleting user reviews; this is covered by F7.
- Moderating or deleting reviews; this is covered by F12.
- Importing game information automatically from external databases or third-party APIs.
- Implementing bulk game imports, bulk edits, or bulk deletions.
- Implementing a full audit-history interface or game-version history.
- Implementing advanced image editing, image cropping, or a dedicated media-management service.
- Introducing additional media types such as movies, television shows, or books.

## 4. Personas & User Stories

- As an administrator, I want to add a game to the catalog so users can discover it and review it.
- As an administrator, I want to edit a game's information so the public catalog remains accurate.
- As an administrator, I want to remove a game that should no longer be listed so the catalog remains manageable.
- As a general user, I want game information to remain accurate so I can make informed decisions about what to play or purchase.
- As a verified reviewer, I want the games I review to have accurate metadata so readers can identify the correct title and platforms.
- As an editorial reviewer, I want the catalog to contain the games I need to review so I can publish relevant official reviews.
- As a developer, I want game-management operations to use the same game model and validation rules as the public application so that data remains consistent.

## 5. Functional Requirements

- **FR-1.** The system MUST provide an administrator-accessible interface for creating, editing, and deleting games.
- **FR-2.** The system MUST restrict game creation, editing, and deletion to authenticated users with administrator privileges.
- **FR-3.** The system MUST enforce administrator authorization on the server for every game-management operation.
- **FR-4.** The system MUST allow administrators to create a game record containing the supported game information: title, description, genre, release date, developer, publisher, platforms, and cover image.
- **FR-5.** The system MUST allow administrators to edit the supported fields of an existing game record.
- **FR-6.** The system MUST allow administrators to delete an existing game record after an explicit confirmation step in the interface.
- **FR-7.** The system MUST validate required fields, field lengths, data types, and supported field formats before creating or updating a game.
- **FR-8.** The system MUST reject invalid game data with an appropriate client error and MUST NOT persist an invalid create or update request.
- **FR-9.** The system MUST return an appropriate not-found response when an administrator attempts to edit or delete a game that does not exist.
- **FR-10.** The system MUST prevent unauthenticated users and non-administrator accounts from performing game-management operations.
- **FR-11.** The system MUST ensure that successful game changes are reflected in subsequent public game-list and game-detail requests.
- **FR-12.** The system MUST handle deletion consistently with existing review relationships and database constraints. It MUST NOT silently orphan reviews or other dependent records.
- **FR-13.** The system MUST provide feedback when a game is created, updated, or deleted successfully, and when an operation fails.
- **FR-14.** The system MUST preserve the distinction between game information and user-generated review content when a game is edited.
- **FR-15.** The system SHOULD prevent accidental duplicate game entries through appropriate validation or duplicate warnings.
- **FR-16.** The system SHOULD provide a clear way for administrators to return to the game list after completing a management operation.
- **FR-17.** The system MUST validate cover-image references or uploads according to the image-handling approach selected by the project.
- **FR-18.** The system MUST NOT expose administrative game-management controls as an alternative to server-side authorization.

## 6. Non-Functional Requirements

- **Performance** - Game creation and updates SHOULD complete within 500 ms at the 95th percentile under the team's agreed development or test workload, excluding external image-upload time and client-side network delays. Delete operations SHOULD complete within the same target for ordinary records, subject to database constraints.
- **Security** - All game-management endpoints MUST require authentication and server-side administrator authorization. The server MUST validate and sanitize incoming data, use parameterized database operations or the project's ORM protections, and reject unauthorized requests regardless of the client interface.
- **Privacy & Compliance** - Game-management responses MUST NOT expose private account data, authentication tokens, or unrelated review-author information.
- **Accessibility** - All new UI MUST target WCAG 2.1 AA. Forms MUST have programmatically associated labels, clear validation messages, keyboard-accessible controls, visible focus indicators, and accessible deletion-confirmation dialogs.
- **Scalability** - Game-management operations MUST act on individual game records for the MVP. The implementation SHOULD use the existing game model and database constraints rather than introduce a separate catalog-management data store.
- **Reliability** - Failed validation or database operations MUST NOT leave partially created or partially updated game records. Deletion behavior MUST be consistent with the chosen database relationship and review-retention policy.
- **Observability** - Unexpected administrative-operation failures MUST be logged with sufficient diagnostic context. Logs MUST NOT include passwords, tokens, or unnecessary sensitive data.
- **Maintainability** - The implementation MUST follow the project's existing server-route, validation, error-handling, database, and UI conventions.
- **Internationalization** - User-facing labels, form validation messages, confirmation prompts, and success/error messages SHOULD be suitable for localization.
- **Backward compatibility** - Changes MUST remain compatible with the game data model established by F4 and the public endpoints used by F5 and F6. Any schema changes MUST follow the repository's migration conventions.

## 7. Acceptance Criteria

- **AC-1.** *Given* an authenticated administrator, *when* the administrator submits valid required game information, *then* the system creates the game and makes it available through the public game API.
- **AC-2.** *Given* an authenticated administrator, *when* the administrator edits an existing game's title, description, or other supported fields with valid values, *then* the system persists the changes and returns the updated game.
- **AC-3.** *Given* an authenticated administrator, *when* the administrator submits invalid game data, *then* the system returns a validation error and does not persist the invalid changes.
- **AC-4.** *Given* an authenticated administrator, *when* the administrator requests deletion of an existing game and confirms the action, *then* the system applies the documented deletion policy and returns a successful response.
- **AC-5.** *Given* an administrator opens the delete confirmation dialog, *when* the administrator cancels the action, *then* the game remains unchanged.
- **AC-6.** *Given* an unauthenticated visitor, *when* the visitor attempts to create, edit, or delete a game through the API, *then* the server rejects the request without modifying the database.
- **AC-7.** *Given* an authenticated general user or verified reviewer, *when* that user attempts to create, edit, or delete a game, *then* the server rejects the request without modifying the database.
- **AC-8.** *Given* an authenticated editorial reviewer who does not have administrator privileges, *when* that user attempts a game-management operation, *then* the server rejects the request.
- **AC-9.** *Given* an administrator attempts to edit or delete a nonexistent game, *when* the request is processed, *then* the server returns an appropriate not-found response.
- **AC-10.** *Given* a game is successfully created or edited, *when* a visitor subsequently browses the game list or opens its detail page, *then* the public API returns the updated game information.
- **AC-11.** *Given* a game has associated reviews, *when* an administrator attempts to delete it, *then* the system follows the documented deletion and review-retention policy without leaving orphaned records.
- **AC-12.** *Given* an administrator submits a game with an invalid cover-image reference or unsupported image format, *when* the request is processed, *then* the system rejects the invalid image data according to the project's image-handling rules.
- **AC-13.** *Given* a game-management request fails because of a server or database error, *when* the interface receives the error, *then* it displays an appropriate failure message and does not falsely report success.
- **AC-14.** *Given* an administrator successfully creates, edits, or deletes a game, *when* the operation finishes, *then* the interface provides clear feedback and the administrator can return to the game-management list.
- **AC-15.** *Given* a non-administrator modifies a client request to call an administrative endpoint directly, *when* the server receives that request, *then* the server denies it regardless of whether administrative controls are visible in the UI.

## 8. Data Model

- The implementation MUST reuse the game model established by F4.
- The game record MUST support the fields defined in the project specification:
  - Title
  - Description
  - Genre
  - Release date
  - Developer
  - Publisher
  - Platforms
  - Cover image
- Required fields, optional fields, field lengths, and valid date and image formats MUST follow the project's agreed game schema.

The database MUST enforce appropriate constraints for required fields and relationships where supported.

## 9. API Surface

- `POST /api/games` - Create a game.
- `PUT /api/games/:id` - Update an existing game.
- `DELETE /api/games/:id` - Delete an existing game.

## 10. UI / UX

- **Administrative Game List** - Provide a page or view listing existing games and exposing management actions to administrators.
- **Create Game Form** - Provide fields for the supported game metadata.
- **Edit Game Form** - Reuse the create form where practical, prepopulated with the selected game's existing values.
- **Delete Confirmation Dialog** - Identify the game being deleted and require explicit confirmation before submitting the request.
- **Validation Feedback** - Show field-specific messages for invalid or missing values.

## 11. AI / ML Considerations

- N/A; No AI/ML in project

## 12. Integration Points

- **User database/model** - Reuse the account roles established by F1.
- **Authentication** - Use the login/session or token infrastructure established by F2 and F3.
- **Game database/model** - Use the schema established by F4.
- **Public game browsing** - Ensure changes are reflected in the list and search experience implemented by F5.
- **Game detail page** - Ensure edits and deletion behavior are reflected by F6.
- **Review system** - Preserve referential integrity and follow the chosen deletion policy for reviews created through F7 and displayed by F8.
- **Rating aggregation** - Ensure deletion or removal of a game does not leave F9 displaying invalid or stale public rating data.
- **Administrative authorization** - Reuse a shared server-side authorization mechanism where one exists rather than implementing inconsistent permission checks separately in each endpoint.

## 13. Dependencies & Sequencing

- Must ship after:
  - **F3.** Register New Users and Log In/Out, including the authentication infrastructure needed to identify the requester.
  - **F4.** Set Up Game Database/Model.

## 14. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Unauthorized users modify the game catalog | M | H | Enforce administrator authorization on the server |
| Deleting a game leaves orphaned reviews | M | H | Define and test deletion policy against foreign-key relationships |
| Duplicate game records are created | M | M | Add duplicate warnings or documented uniqueness policy |

## 15. Rollout Plan

- **Feature flag:** A feature-specific flag is not required for the MVP unless the team adopts a general feature-flag mechanism.
- **Migration sequencing:** No migration is expected if F4 already provides the required game schema. If schema changes are necessary, apply migrations before deploying code that depends on them.
- **Development validation:** Seed a small game catalog and test valid and invalid create, edit, and delete operations.
- **Authorization validation:** Test administrator, editorial reviewer, verified reviewer, general user, and unauthenticated access against every write endpoint.
- **Integration validation:** Confirm that changes appear in public game-list and detail endpoints and that deletion follows the selected review-retention policy.
- **Release criteria:** All acceptance criteria MUST pass, unauthorized write attempts MUST be rejected, and game operations MUST preserve database integrity.
- **Rollback path:** Revert the administrative UI and API changes if they cause a blocking regression. Preserve existing game and review data. If a migration has been applied, follow a reviewed rollback or forward-fix procedure rather than blindly deleting data.

## 16. Test Plan

- **Unit** - Test game-field validation, request parsing, authorization helpers, and form validation and feedback.
- **Integration** - Test POST /api/games, PUT /api/games/:id, and DELETE /api/games/:id against the database, including validation failures, nonexistent IDs, and dependent review records.
- **End-to-end** - Test administrator creation, editing, and deletion flows, including deletion confirmation and cancellation. Use Playwright if selected by the team.
- **Security** - Test unauthenticated requests and every non-administrator role against all write endpoints. Verify that direct API requests cannot bypass UI restrictions.
- **Accessibility** - Test form labels, field-level errors, keyboard navigation, focus management, confirmation dialogs, and screen-reader feedback.
- **Performance/load** - Measure create, update, and delete latency under the team's agreed workload and verify that operations do not trigger unnecessary full-catalog reloads.
- **Manual exploratory** - Test missing fields, excessively long text, invalid dates, invalid image references, duplicate titles, network failures, repeated submissions, cancellation, nonexistent game IDs, and games with associated reviews.

## 17. Documentation & Training

- Document the administrative game-management UI and its supported workflows.
- Document the three game-management API endpoints, authorization requirements, request schemas, and error responses.
- Document game-field validation rules and the selected cover-image storage approach.
- Document the game's deletion policy and its effect on associated reviews and aggregate ratings.
- Document how to configure an administrator account in the development environment without exposing credentials.
- Document how to run the relevant unit, integration, security, and end-to-end tests.

## 18. Open Questions

1. Should deleting a game permanently remove its record, hide it from public listings, or be blocked while reviews exist?
2. If a game is deleted or hidden, should its reviews and aggregate ratings remain available to administrators?
3. Which game fields are mandatory, and what are the maximum permitted lengths for each text field?
4. Should game titles be unique, or should the application allow similarly named games with different release dates or platforms?
5. Should cover images be entered as URLs, uploaded to the server, or stored using an external image-hosting service?
6. Should the administrative game list support search or reuse the public game-search endpoint from F5?
7. Should the game-management UI be a separate administrative page or part of the existing game detail interface?
8. Should create and update operations use full replacement semantics for PUT, or does the project intend to support partial updates through this endpoint?
9. What role representation and authorization middleware will F11 use, and can F10 reuse it before F11 is complete?

## 19. References

- Related plans: `F3-register_new_users_and_log_in_out.md`
- Related plans: `F4-set_up_game_database_model.md`
