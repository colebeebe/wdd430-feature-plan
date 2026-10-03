# F11 — View a List of Users and Edit Roles as an Administrator

> Implementation plan. Source: [docs/MISSING_FEATURES.md](../MISSING_FEATURES.md) §{section}.

## Metadata

| Field | Value |
|---|---|
| **Feature ID** | F11 |
| **Section** | Basic Administration |
| **Severity** | MAJOR |
| **Markets** | General Web Audience |
| **Status (today)** | MISSING |
| **Estimated effort** | S (1w) |
| **Owner (proposed)** | team |
| **Depends on** | F1, F2, F3 |
| **Unblocks** | N/A |

---

## 1. Problem Statement

The application requires administrators to manage registered accounts and assign appropriate permissions as the user base grows. Without an administrative user-management interface, account roles cannot be conveniently reviewed or changed, and administrators cannot manage the privileges associated with general users, verified reviewers, editorial reviewers, and other administrators. This feature provides an administrator-only interface for viewing registered users and managing their roles while protecting account security and preventing unauthorized privilege escalation.

## 2. Goals

- Provide administrators with a list of registered user accounts and their relevant account information.
- Allow administrators to view individual user details needed for account management.
- Allow authorized administrators to change a user's role among the supported account roles.
- Allow administrators to grant or remove verified-reviewer status according to the application's existing user model.
- Enforce role-management permissions on the server for every administrative operation.

## 3. Non-Goals

- Creating a new user database or user model; this is covered by F1.
- Allowing users to edit their own profile information; this belongs to the existing profile functionality, if implemented separately.
- Deleting user accounts; account deletion may be included in the administrative API but is outside this feature's primary scope unless required by the existing specification.
- Moderating or deleting user reviews; this is covered by F12.
- Creating or editing games; this is covered by F10.
- Implementing advanced user analytics, account activity dashboards, or reporting.

## 4. Personas & User Stories

- As an administrator, I want to view a list of registered users so that I can understand and manage the accounts using the platform.
- As an administrator, I want to inspect a user's account type so that I can determine whether their permissions are appropriate.
- As an administrator, I want to promote a general user to verified reviewer when appropriate so that recognized community members can publish reviews with verified status.
- As an administrator, I want to change a user's role so that the account has the permissions required for its responsibilities.
- As an administrator, I want to remove verified status from an account so that reviewer designations remain accurate.

## 5. Functional Requirements

- **FR-1.** The system MUST provide an administrative interface for viewing registered user accounts.
- **FR-2.** The system MUST restrict the administrative user-management interface and its protected API operations to authenticated administrators.
- **FR-3.** The system MUST enforce administrator authorization on the server for every role-management or verification-management operation.
- **FR-4.** The system MUST retrieve user information from the existing user model established by F1.
- **FR-5.** The system MUST display sufficient information to distinguish accounts, including a stable user identifier, display name or username, email address where appropriate for administrators, and current role.
- **FR-6.** The system MUST identify verified-reviewer status separately from other account information when the existing data model represents verification independently.
- **FR-7.** The system MUST allow an administrator to change a user's role among the supported roles: general user, verified reviewer, editorial reviewer, and administrator.
- **FR-8.** The system MUST validate role-change requests against the application's supported role values and MUST reject invalid role values.
- **FR-9.** The system MUST allow administrators to grant or remove verified-reviewer status if verification is represented independently from the account role.
- **FR-10.** The system MUST prevent unauthenticated users and non-administrator accounts from changing user roles or verification status.
- **FR-11.** The system MUST prevent a user from obtaining administrator privileges through a self-service request or by modifying a client-side request without administrator authorization.
- **FR-12.** The system MUST return an appropriate not-found response when an administrator attempts to manage a nonexistent user.
- **FR-13.** The system MUST return an appropriate validation error for unsupported roles or malformed management requests and MUST NOT persist invalid changes.

## 6. Non-Functional Requirements

- **Performance** - User-list requests SHOULD complete within 500 ms at the 95th percentile under the team's agreed development or test workload. The implementation SHOULD avoid loading unnecessary profile or review data when retrieving the list of users.
- **Security** - All administrative user-management endpoints MUST require authentication and server-side administrator authorization. The server MUST validate role values, prevent privilege escalation, and avoid exposing authentication secrets. Authorization MUST be enforced independently of whether administrative controls are visible in the client. Any role-change operation MUST use the existing authentication and authorization infrastructure established by F2 and F3.
- **Privacy & Compliance** - The administrative interface MUST display only account information needed for user management. Email addresses and other non-public account information MUST NOT be exposed through public endpoints as a side effect of administrative functionality. The project MUST avoid collecting or displaying unnecessary personal information.
- **Accessibility** - All new UI MUST target WCAG 2.1 AA. The user list MUST have clear labels and headings, keyboard-accessible actions, visible focus indicators, sufficient color contrast, and accessible status messages. Role selectors and confirmation dialogs MUST be usable with assistive technologies.
- **Scalability** - The implementation SHOULD retrieve only the fields needed for the user list. If the number of registered users grows beyond a reasonable single-page result set, the API SHOULD support pagination rather than returning every account in one response.
- **Reliability** - Failed validation or database operations MUST NOT leave partially updated account records. A successful role change MUST be persisted before the interface reports success. Failed operations MUST leave the user's previous role and verification status unchanged.
- **Observability** - Unexpected administrative-operation failures SHOULD be logged with sufficient diagnostic context. Logs MUST NOT contain passwords, authentication tokens, or unnecessary personal information. If administrative action logging already exists, role changes SHOULD include the acting administrator, target user, and change outcome.
- **Maintainability** - The implementation MUST follow existing server-route, validation, authorization, database, error-handling, and UI conventions. Role definitions MUST be reused rather than duplicated inconsistently across multiple modules.
- **Internationalization** - User-facing labels, role names, validation messages, and success/error messages SHOULD be suitable for localization.
- **Backward compatibility** - Changes MUST remain compatible with the user model established by F1 and the authentication infrastructure established by F2 and F3. Existing user accounts MUST remain valid, and any schema changes MUST follow the repository's migration conventions.

## 7. Acceptance Criteria

- **AC-1.** *Given* an authenticated administrator, *when* the administrator opens the user-management page, *then* the system displays the registered users and their relevant account information.
- **AC-2.** *Given* an unauthenticated visitor, *when* the visitor attempts to access the administrative user-list endpoint, *then* the server rejects the request without exposing protected account information.
- **AC-3.** *Given* an authenticated general user, *when* that user attempts to access an administrative user-management endpoint, *then* the server rejects the request.
- **AC-4.** *Given* an authenticated verified reviewer, *when* that user attempts to change another user's role, *then* the server rejects the request without modifying the target account.
- **AC-5.** *Given* an authenticated editorial reviewer without administrator privileges, *when* that user attempts to access administrative role-management operations, *then* the server rejects the request.
- **AC-6.** *Given* an authenticated administrator, *when* the administrator changes a general user's role to verified reviewer using a supported role-change operation, *then* the system persists the change and subsequent user-management requests display the updated role.
- **AC-7.** *Given* an authenticated administrator, *when* the administrator assigns an unsupported role value, *then* the server returns a validation error and the user's existing role remains unchanged.
- **AC-8.** *Given* an authenticated administrator, *when* the administrator attempts to manage a nonexistent user, *then* the server returns an appropriate not-found response.
- **AC-9.** *Given* an administrator successfully changes a user's role, *when* the target user subsequently makes an API request, *then* the server evaluates authorization using the updated role according to the existing authorization model.
- **AC-10.** *Given* an administrator grants or removes verified-reviewer status, *when* the change is successfully persisted, *then* subsequent profile and review displays reflect the updated verification status.
- **AC-11.** *Given* a non-administrator modifies a client request to call a role-management endpoint directly, *when* the server receives that request, *then* the server denies the operation regardless of the controls visible in the UI.
- **AC-12.** *Given* an administrator opens the user-management page, *when* the server returns an empty user list, *then* the interface displays an appropriate empty state rather than an error or broken layout.
- **AC-13.** *Given* a user-list request fails because of a server or database error, *when* the interface receives the error, *then* it displays an appropriate failure message and does not falsely report that the user list loaded successfully.
- **AC-14.** *Given* an administrator submits a role change and the server rejects it, *when* the interface receives the response, *then* it preserves or reloads the authoritative role value and informs the administrator that the change failed.
- **AC-15.** *Given* an administrator views a user record, *when* the user information is returned by the API, *then* the response does not contain passwords, password hashes, authentication tokens, or other authentication secrets.
- **AC-16.** *Given* a user has existing reviews, *when* an administrator changes that user's role or verification status, *then* the system preserves the existing reviews and does not modify their content.
- **AC-17.** *Given* an administrator attempts to remove their own administrator privileges and the operation would leave no accessible administrator account, *when* the server processes the request, *then* the system rejects the change or applies the project's documented last-administrator safeguard.
- **AC-18.** *Given* an administrator successfully changes a user's role, *when* the operation finishes, *then* the interface provides clear feedback and displays the updated account information.

## 8. Data Model

- The implementation MUST reuse the user model established by F1.
- The existing user record MUST provide a stable identifier and the account information needed by the administrative interface.
- The user model MUST support the four account roles defined by the project:
  - General user
  - Verified reviewer
  - Editorial reviewer
  - Administrator
- The implementation MUST reuse the role representation established by F1 rather than introduce a conflicting role field.

## 9. API Surface

- `GET /api/users` - Retrieve the user list. Requires administrator authorization.
- `GET /api/users`/-id - Retrieve a user record. Public and private fields MUST follow the existing profile-access rules.
- `PUT /api/users/:id/role` - Change a user's role. Requires administrator authorization.
- `PUT /api/users/:id/verification` - Grant or remove verified-reviewer status. Requires administrator authorization.

## 10. UI / UX

- **Administrative User List** - Provide an administrator-only page or view listing registered accounts.
- **Role Management Control** - Provide a selector or equivalent control for assigning supported roles.
- **Verification Management** - Provide an explicit action to grant or remove verified-reviewer status.

## 11. AI / ML Considerations

- N/A; No AI/ML in project

## 12. Integration Points

- **Registration and login** - Reuse the account identity and session or token infrastructure established by F3.
- **Authorization** - Reuse shared server-side authorization middleware where available.
- **User profiles** - Ensure that role and verification changes are reflected in relevant profile displays.
- **Review system** - Ensure that role and verification changes are reflected in reviewer designations on reviews created and displayed through F7 and F8.
- **Rating aggregation** - Ensure that any role-dependent rating calculations implemented by F9 remain consistent with the application's defined rules when account classifications change. The precise historical-rating behavior must follow the project's chosen policy.

## 13. Dependencies & Sequencing

- Must ship after:
- **F1.** Set Up User Database/Model — The existing user model and role representation must be available.
- **F2.** Set Up Authentication Infrastructure — The server must be able to identify authenticated requesters.
- **F3.** Register New Users and Log In/Out — The application must have working account registration and authentication flows.

## 14. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Unauthorized users can change account roles | M | H | Enforce administrator authorization on the server for every protected operation |
| A user obtains administrator privileges through a manipulated request | M | H | Validate role-change permissions server-side and reject requests from non-administrators |
| Role changes are not reflected in subsequent authorization checks | M | H | Ensure permission checks use the current persisted role and account state |

## 15. Rollout Plan

- **Feature flag:** A feature-specific flag is not required for the MVP unless the team adopts a general feature-flag mechanism.
- **Migration sequencing:** No migration is expected if F1 already provides the required role and verification fields. If schema changes are necessary, apply and validate migrations before deploying code that depends on them.
- **Development validation:** Seed test accounts representing all four supported roles and verify that the administrative interface displays their information correctly.
- **Authorization validation:** Test the user-list, role-change, and verification endpoints with an administrator, editorial reviewer, verified reviewer, general user, and unauthenticated requester.
- **Privilege-escalation validation:** Attempt direct API requests and manipulated role values to verify that server-side authorization cannot be bypassed.
- **Integration validation:** Confirm that role and verification changes are reflected in subsequent authorization checks, profile displays, and review designations.
- **Release criteria:** All acceptance criteria MUST pass, unauthorized management requests MUST be rejected, and role changes MUST preserve account and review integrity.
- **Rollback path:** Revert the administrative UI and API changes if they cause a blocking regression. Preserve existing user and review data. If a migration has been applied, follow a reviewed rollback or forward-fix procedure rather than blindly deleting or resetting account data.

## 16. Test Plan

- **Unit** - Test role validation, supported role values, verification-state handling, authorization helpers, user-response serialization, and frontend role-management controls.
- **Integration** - Test GET /api/users, PUT /api/users/:id/role, and PUT /api/users/:id/verification against the database. Cover successful updates, invalid role values, nonexistent users, authorization failures, and database errors.
- **End-to-end** - Test the administrator's user-list and role-change workflows, including success feedback, failed updates, and any confirmation required for elevated privileges. Use Playwright if selected by the team.
- **Security** - Test unauthenticated access and every non-administrator role against protected endpoints. Attempt self-promotion, direct API requests, malformed role values, and requests containing unauthorized user fields.
- **Accessibility** - Test labels, keyboard navigation, focus visibility, role selectors, confirmation controls, responsive layouts, and screen-reader announcements. Use automated accessibility checks where available.
- **Performance/load** - Measure user-list latency under the team's agreed workload. Verify that responses contain only necessary fields and that pagination, if implemented, avoids unnecessary full-table retrieval.
- **Manual exploratory** - Test empty user lists, long usernames, missing optional profile fields, repeated submissions, server errors, invalid user IDs, role changes, verification changes, last-administrator protection, and consistency between the administrative interface and public profile/review displays.

## 17. Documentation & Training

- Document the administrative user-management interface and supported workflows.
- Document the supported account roles and the permissions associated with each role.
- Document the distinction between account role and verified-reviewer status, if represented separately.
- Document the user-list and role-management API endpoints, authorization requirements, request schemas, and error responses.
- Document the procedure for configuring an initial administrator account in the development environment without exposing credentials.
- Document any last-administrator safeguard and the recovery procedure for accidental privilege changes.
- Document how role changes affect reviewer designations and rating aggregation, according to the project's chosen policy.
- Document how to run the relevant unit, integration, security, and end-to-end tests.

## 18. Open Questions

1. Does F1 represent verified-reviewer status as a separate field, or is verified reviewer one of the account roles?
2. Can an administrator change a user's role directly to administrator, or should administrator privileges require a separate process?
3. Should administrators be prevented from demoting their own accounts, and must the application always retain at least one administrator?
5. Should the user list display email addresses to administrators, or should it use a smaller set of account-identifying fields?
6. Should the user list support search and pagination in the initial implementation?
7. Should administrators be able to manage their own role or verification status?
8. When a user's role or verification status changes, should historical reviews retain the reviewer classification they had when published, or should all reviews reflect the account's current classification?
8. How should rating aggregates respond when an account changes between general-user, verified-reviewer, and editorial-reviewer classifications?
9. Should changes to user roles and verification status be recorded in an audit log, and does the project already have an audit-logging mechanism?
10. Does the existing API use a particular naming convention for role values, verification fields, and error responses that this feature must follow?

## 19. References

- Related plans: `F1-set_up_user_database_model.md`
- Related plans: `F2-set_up_authentication_infrastructure.md`
- Related plans: `F3-register_new_users_and_log_in_out.md`
