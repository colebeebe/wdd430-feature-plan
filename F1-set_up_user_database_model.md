# F1 — Set Up User Database/Model

> Implementation plan. Source: [docs/MISSING_FEATURES.md](../MISSING_FEATURES.md) §{section}.

## Metadata

| Field | Value |
|---|---|
| **Feature ID** | F1 |
| **Section** | User Accounts |
| **Severity** | MAJOR |
| **Markets** | General Web Audience |
| **Status (today)** | MISSING |
| **Estimated effort** | S (1w) |
| **Owner (proposed)** | team |
| **Depends on** | N/A |
| **Unblocks** | Refer to **#13. Dependencies and Sequencing** |

---

## 1. Problem Statement

A database must be present to hold user data. This is necessary so that different roles can be present for each of the account types. Addressing this early will allow for testing of the various features available to each role.

## 2. Goals

- Each user should have a few fields that hold the relevant personal data
- Passwords **MUST** be stored as hashes, **NEVER** as plain text
- Each user should have a role assigned to them from an enum, with a default value of general user

## 3. Non-Goals

- User reviews are handled by a separate feature

## 4. Personas & User Stories

- As a user, I want my data to be stored safely and effectively so that the interaction on the frontend is seamless
- As a verified user or an editorial reviewer I want roles to be assigned correctly so that I am properly recognized
- As an admin, I want the database to be clean and maintainable so that any operations can be handled effortlessly

## 5. Functional Requirements

- **FR-1.** The system MUST provide a persistent user record for each registered user.
- **FR-2.** Each user record MUST have a unique identifier.
- **FR-3.** Each user record MUST store a unique email address.
- **FR-4.** Each user record MUST store a password as a hash rather than a plaintext password.
- **FR-5.** Each user record MUST store a user role that identifies the account as a General User, Verified User, Editorial Reviewer, or Administrator.
- **FR-6.** The system MUST assign the General User role to newly created users by default.
- **FR-7.** The system MUST prevent duplicate user records from being created with the same email address.
- **FR-8.** The system MUST store the date and time when a user account was created.
- **FR-9.** The system MUST store the date and time when a user account was updated (initially set to the creation date and time).
- **FR-10.** The data model SHOULD support updating a user's profile informaation without requiring the user record to be recreated.

## 6. Non-Functional Requirements

- **Performance** — Database operations for creating, retrieving, and updating user a user record SHOULD normally complete within 500ms under load.
- **Security** — The system MUST never store plain text passwords. Passwords MUST be stored using a secure, industry-standard hashing algorithm.
- **Privacy & Compliance** — The system SHOULD store only user information necessary for the application's functionality. No specific regulatory compliance should be expected.
- **Accessibility** — N/A; This feature is a backend data-model feature and should not directly introduce user-interface components
- **Scalability** — The user model SHOULD support at least several thousand user records without requiring changes to the database schema.
- **Reliability** — The database MUST enforce required fields and uniqueness constraints so that invalid or duplicate user records cannot be created.
- **Observability** — Database errors SHOULD be logged with enough information to diagnose failures without logging passwords or other sensitive credentials.
- **Maintainability** — The user model SHOULD use clear field names, documented relationships, and database constraints consistent with the rest of the application.
- **Internationalization** — N/A; The user database/model does not directly generate user-facing localized text.
- **Backward compatibility** — Future changes to the user model SHOULD use database migrations so that existing user records are preserved.

## 7. Acceptance Criteria

- **AC-1.** *Given* the database has been initialized, *when* the user model is inspected, *then* the required user fields and constraints are present.
- **AC-2.** *Given* a user record does not already exist, *when* a user is created with a valid unique identifier, email address, password hash, and role, *then* the user record is successfully stored in the database.
- **AC-3.** *Given* a user already exists with a particular email address, *when* another user is created with the same email address, *then* the database rejects the duplicate record.
- **AC-4.** *Given* a new user is created without specifying an account role, *when* the user record is stored, *then* the user's role defaults to General User.
- **AC-5.** *Given* a user account is created, *when* the stored user record is inspected, *then* the password field contains a secure password hash and does not contain the user's plaintext password.
- **AC-6.** *Given* a user account exists, *when* the user record is retrieved, *then* the record contains the information necessary to associate that user with reviews they create.
- **AC-7.** *Given* the database contains existing user records, *when* a database migration for a future user-model change is applied, *then* existing user records remain intact.

## 8. Data Model

- Create a `users` table containing:
  - `id` - unique identifier for the user
  - `email` - user's email address; required and unique
  - `password_hash` - securely hashed password; required
  - `role` user's account type; required
  - `created_at` - timestamp indicating when the account was created
  - `updated_at` - timestamp indicating when the account was last updated
- The `id` key MUST be the primary key for the `users` table
- No backfill is required if the application currently contains no user records. If existing user records exist when this feature is introduced, the migration MUST preserve those records.

## 9. API Surface

- No new HTTP endpoint is required specifically for user database/model
- Authentication and authorization MUST be enforced by the API layer rather than relying solely on the databse

## 10. UI / UX

- N/A; No UI or UX is required for database implementation

## 11. AI / ML Considerations

- N/A; No AI/ML in project

## 12. Integration Points

- The user model integrates with the application's relational database

## 13. Dependencies & Sequencing

- Must ship before:
  - **F2.** Set Up Authentication Infrastructure
  - **F3.** Register a New User
  - **F4.** Log In as a Registered User
  - **F5.** Log Out of an Account
  - **F7.** Edit Your Own User Profile
  - **F8.** Assign User Roles
  - **F9.** Display a Verified User Designation on Profiles/Reviews
  - **F15.** Allow Users to Create a Game Rating From 0-5 Stars
  - **F16.** Allow Users to Write a Text Review
  - **F17.** Allow users to Edit Their Own Reviews
  - **F18.** Allow users to Delete Their Own Reviews
  - **F19.** Display the Reviewer's Account Type on Reviews
  - **F25.** Create Games as an Administrator
  - **F26.** Edit Games as an Administrator
  - **F27.** Delete Games as an Administrator
  - **F28.** View a List of Users as an Administrator
  - **F29.** Change a User's Role as an Aministrator
  - **F30.** Grant or Remove Verified Status as an Administrator
  - **F31.** Moderate/Delete User Reviews as an Administrator

## 14. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Passwords are stored insecurely or exposed through the database | M | H | Store only hashed passwords |
| Duplicate email addresses are allowed | M | M | Add a unique constraint to the email field |
| Users are accidentally assigned elevated roles | L | H | Default all new users to the General User role and restrict changes to authorized admins |
| Invalid or incomplete user records are created | M | M | Use fields, database constraints, and server-side validation before inserting records |

## 15. Rollout Plan

- Implement and test user model in a development environment before integrating it with authentication, profiles, reviews, and ratings.
- If implementation causes problems, revert the database migration and associated code changes. Existing data should be backed up before destructive schema changes are made.

## 16. Test Plan

- **Unit** — Test user-model validation, default role assignment, and required fields. Verify that invalid user data is rejected.
- **Integration** — Test user model against development database, validating that all checks pass.
- **End-to-end** — N/A.
- **Security** — Verify passwords are stored as hashes and never plain text.
- **Accessibility** — N/A; no user interface.
- **Performance / load** — Test user creation and retrieval under expected load.
- **Manual exploratory** — Inspect representative user records to confirm required fields, constraints, default values, and relationships are present and functioning correctly.

## 17. Documentation & Training

- Document available user roles and their purpose for future developers and administrators
- Update API documentation to describe how endpoints interact with the user model

## 18. Open Questions

1. What databse system will be used for the project?
2. What password-hashing library and algorithm will be used?
3. Should users be allowed to change their email address after registration, and if so, will the change require verification?

## 19. References

- Related plans: `F2-set_up_authentication_infrastructure.md`
- Related plans: `F3-register_a_new_user.md`
- Related plans: `F4-log_in_as_a_registered_user.md`
- Related plans: `F5-log_out_of_an_account.md`
- Related plans: `F7-edit_your_own_user_profile.md`
- Related plans: `F8-assign_user_roles.md`
- Related plans: `F9-display_a_verified_user_designation_on_profiles/reviews.md`
- Related plans: `F15-allow_users_to_create_a_game_rating_from_0-5_stars.md`
- Related plans: `F16-allow_users_to_write_a_text_review.md`
- Related plans: `F17-allow_users_to_edit_their_own_reviews.md`
- Related plans: `F18-allow_users_to_delete_their_own_reviews.md`
- Related plans: `F19-display_the_reviewer's_account_type_on_reviews.md`
- Related plans: `F25-create_games_as_an_administrator.md`
- Related plans: `F26-edit_games_as_an_administrator.md`
- Related plans: `F27-delete_games_as_an_administrator.md`
- Related plans: `F28-view_a_list_of_users_as_an_administrator.md`
- Related plans: `F29-change_a_user's_role_as_an_aministrator.md`
- Related plans: `F30-grant_or_remove_verified_status_as_an_administrator.md`
- Related plans: `F31-moderate/delete_user_reviews_as_an_administrator.md`
