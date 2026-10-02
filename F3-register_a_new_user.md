# F3 — Register New Users and Log In/Out

> Implementation plan. Source: [docs/MISSING_FEATURES.md](../MISSING_FEATURES.md) §{section}.

## Metadata

| Field | Value |
|---|---|
| **Feature ID** | F3 |
| **Section** | User Accounts |
| **Severity** | BLOCKER |
| **Markets** | General Web Audience |
| **Status (today)** | MISSING |
| **Estimated effort** | S (1w) |
| **Owner (proposed)** | team |
| **Depends on** | F1, F2 |
| **Unblocks** | F7, F10, F11, F12 |

---

## 1. Problem Statement

Users need a way to create accounts and authenticate themselves before accessing functionality that requires an account. Without registration and login, the application cannot reliably associate reviews with their authors or restrict administrative and reviewer capabilities to authorized users. Implementing registration, login, logout, and current-user retrieval will establish the entry point for authenticated interactions throughout the application.

## 2. Goals

- Allow visitors to register an account using a valid email address and password.
- Allow registered users to log in using their credentials and establish a server-side session.
- Allow authenticated users to log out and invalidate their active session.
- Allow the frontend to determine whether a user is authenticated and retrieve the current user's public account information.
- Provide consistent validation and error responses without exposing passwords, password hashes, session identifiers, or other sensitive information.

## 3. Non-Goals

- Implementing the user database schema or core session infrastructure, which are covered by F1 and F2.
- Implementing profile editing or account deletion.
- Implementing password reset, email verification, multi-factor authentication, or third-party sign-in.
- Implementing administrative role management or reviewer verification.
- Implementing game reviews, ratings, or other authenticated application features.
- Introducing JWT-based authentication; this feature uses the server-side session approach established by F2.

## 4. Personas & User Stories

- As a new user, I want to be able to create an account with an email address and password
- As a user, I want to be able to log in to or out of my account
- As an admin, I want all new users to be automatically assigned to the General Users role

## 5. Functional Requirements

- **FR-1.** The system MUST provide a registration endpoint that accepts an email address and password.
- **FR-2.** The system MUST validate that the email address is present, syntactically valid, and within the application's documented length limits.
- **FR-3.** The system MUST validate passwords against a documented minimum-length policy before creating an account.
- **FR-4.** The system MUST normalize email addresses consistently before checking uniqueness and storing them.
- **FR-5.** The system MUST reject registration attempts when an account already exists with the same normalized email address.
- **FR-6.** The system MUST assign the default General User role to newly registered accounts. Registration requests MUST NOT allow users to assign themselves elevated roles or verified status.
- **FR-7.** The system MUST store passwords only as secure password hashes using the approved password-hashing mechanism established for the project. Plaintext passwords MUST NOT be stored.
- **FR-8.** The system MUST provide a login endpoint that accepts an email address and password and verifies the credentials against the stored account record.
- **FR-9.** When valid credentials are supplied, the system MUST establish an authenticated server-side session using the session infrastructure provided by F2.
- **FR-10.** When invalid credentials are supplied, the system MUST reject the login attempt without creating an authenticated session.
- **FR-11.** The system SHOULD use a consistent authentication error message for an unknown email address and an incorrect password to reduce account-enumeration risk.
- **FR-12.** The system MUST provide a logout endpoint that invalidates the current server-side session.
- **FR-13.** After successful logout, the browser's session cookie MUST be cleared or expired according to the session configuration, and the invalidated session MUST NOT authorize subsequent requests.
- **FR-14.** The system MUST provide an endpoint that returns the current authenticated user's public account information when a valid session exists.
- **FR-15.** The current-user endpoint MUST reject requests without a valid authenticated session.
- **FR-16.** Responses MUST NOT expose password hashes, session identifiers, or other authentication secrets.
- **FR-17.** Authentication endpoints MUST return documented HTTP status codes and structured error responses for validation failures, invalid credentials, duplicate registration, and unauthenticated requests.
- **FR-18.** Authentication endpoints MUST apply appropriate rate limiting or abuse controls to registration and login attempts.
- **FR-19.** The system MUST use secure cookie settings appropriate to the deployment environment, including HttpOnly, SameSite, and Secure in production over HTTPS.
- **FR-20.** The system MUST prevent session fixation by ensuring that successful authentication establishes a newly generated or regenerated session identifier.
- **FR-21.** Authentication state MUST be derived from the server-validated session, not from client-provided role values or other untrusted client state.


## 6. Non-Functional Requirements

- **Performance** - Registration and login SHOULD normally complete within 1 second at the 95th percentile under the expected development workload, excluding unusually slow network connections. Password hashing must use a secure configuration; performance targets MUST NOT justify weakening the hashing algorithm.
- **Security** - Password verification MUST use a secure, industry-standard password-hashing algorithm and library. Session identifiers MUST be generated securely. Production session cookies MUST use HttpOnly, Secure, and an appropriate SameSite policy. Authentication endpoints MUST be protected against brute-force attempts, session fixation, and common injection attacks. All production traffic MUST use HTTPS.
- **Privacy & Compliance** - The system SHOULD collect only the information required to create and authenticate accounts. Logs MUST NOT contain plaintext passwords, password hashes, session cookies, or session identifiers. No specific regulatory compliance obligation is assumed without further project requirements.
- **Accessibility** - Any registration and login interfaces added by this feature MUST meet WCAG 2.1 AA requirements. Form controls MUST have programmatic labels, validation errors MUST be identifiable to assistive technology, and keyboard users MUST be able to complete both flows.
- **Scalability** - The authentication implementation SHOULD support multiple application instances if required by the eventual deployment. Session storage MUST use a shared, supported store if requests can be routed across multiple instances; in-memory sessions MUST NOT be treated as durable production storage.
- **Reliability** - Session-store failures MUST NOT cause the application to treat unauthenticated requests as authenticated. Failed registration or login attempts MUST NOT leave partially created accounts or unintended authenticated sessions.
- **Observability** - The application SHOULD record authentication success/failure counts, registration outcomes, rate-limit events, and session-store errors. Logs MUST exclude credentials and session secrets.
- **Maintainability** - Authentication validation, credential verification, session establishment, and session termination SHOULD be separated into testable application modules consistent with the chosen stack.
- **Internationalization - User-facing authentication strings SHOULD be kept separate from application logic so that localization can be added later.
- **Backward compatibility** - Authentication changes MUST remain compatible with the session configuration established in F2. Future changes to user or session storage MUST use migrations or equivalent safe changes when existing data needs to be preserved.

## 7. Acceptance Criteria

- **AC-1.** *Given* a visitor submits a valid email address and acceptable password that are not already registered, *when* the registration request is processed, *then* a new account is created with the General User role.
- **AC-2.** *Given* an account already exists for a normalized email address, *when* a visitor attempts to register with an equivalent email address, *then* the request is rejected and no duplicate account is created.
- **AC-3.** *Given* a visitor submits a missing or invalid email address or a password that fails the documented password policy, *when* registration is attempted, *then* the request is rejected with a suitable validation response.
- **AC-4.** *Given* a visitor submits a registration request containing an administrator role, editorial role, or verified designation, *when* the request is processed, *then* the supplied privilege fields are ignored or rejected and the created account receives only the default General User role.
- **AC-5.** *Given* a registered user supplies the correct email address and password, *when* the login endpoint processes the request, *then* an authenticated server-side session is established and the browser receives the configured session cookie.
- **AC-6.** *Given* a user supplies an unknown email address or an incorrect password, *when* login is attempted, *then* authentication fails, no authenticated session is established, and the response does not unnecessarily disclose whether the account exists.
- **AC-7.** *Given* a user has a valid authenticated session, *when* the current-user endpoint is called, *then* the response contains the user's public account information and role without exposing the password hash or session identifier.
- **AC-8.** *Given* a request has no valid authenticated session, *when* the current-user endpoint is called, *then* the server returns an unauthenticated response.
- **AC-9.** *Given* a user has an authenticated session, *when* the user logs out successfully, *then* the server invalidates that session and subsequent requests using the old session identifier are no longer authenticated.
- **AC-10.** *Given* a user successfully logs in, *when* the session identifier before authentication is compared with the authenticated session identifier, *then* the identifier has been regenerated or replaced to prevent session fixation.
- **AC-11.** *Given* authentication requests exceed the configured rate limit, *when* additional requests are submitted, *then* the abuse-control mechanism rejects or delays requests according to the documented policy.
- **AC-12.** *Given* a database or session-store error occurs during registration or login, *when* the request fails, *then* the server returns a safe error response, logs sufficient diagnostic information without secrets, and does not report authentication success.

## 8. Data Model

- This feature MUST use the users model established by F1. It MUST NOT introduce a duplicate user table.
- Registration MUST populate the existing user fields required by F1, including the normalized unique email address, password hash, default role, and creation/update timestamps.
- The password MUST be hashed using the approved password-hashing library before being stored. Password hashing SHOULD use a password-specific algorithm such as Argon2id or an appropriately configured alternative approved by the project.
- Session persistence MUST use the session store and schema established by F2. If F2 does not provide a persistent session store, that dependency MUST be resolved before this feature is considered complete.
- No additional database migration is expected unless registration reveals a missing field or constraint in F1 or F2.
- The database MUST enforce email uniqueness so concurrent registration requests cannot create duplicate accounts.
- Failed registration attempts MUST NOT leave incomplete user records.
- Backfill is not required for a new application with no existing accounts. Any existing accounts MUST be preserved if schema changes are required.

## 9. API Surface

- The following routes implement the authentication endpoints described in the project specification. Exact request validation and response schemas SHOULD be documented in the project's API reference.
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/logout`
  - `GET /api/auth/me`

## 10. UI / UX
- **Registration page:** Email and password fields, a submit button, inline validation messages, and a link to the login page.
- **Login page:** Email and password fields, a submit button, an authentication error message, and a link to the registration page.
- **Authentication state:** Shared frontend state that reflects the result of GET /api/auth/me. The browser MUST NOT treat client-side state alone as proof of authentication.
- **Logout control:** A visible action for authenticated users that submits the logout request and updates the interface after successful session invalidation.

## 11. AI / ML Considerations

- N/A; No AI/ML in project

## 12. Integration Points

- **User model:** Uses the persistent user records, unique email constraint, role defaults, and password-hash field established by F1.
- **Authentication infrastructure:** Uses the server-side session configuration, cookie handling, session storage, and middleware established by F2.
- **Frontend application:** Registration, login, logout, and session-restoration components consume the authentication API.
- **Protected API routes:** F7, F10, F11, and F12 rely on authenticated identity and role information established by this feature and enforced by the authorization infrastructure.
- **Logging and abuse controls:** Uses the project's shared logging and rate-limiting mechanisms, if provided by F2 or the chosen framework.
- **External services:** No external authentication provider is required for the MVP.

## 13. Dependencies & Sequencing
- Must ship after:
  - **F1.** Set Up User Database/Model.
  - **F2.** Set Up Authentication Infrastructure.
- Must ship before:
  - **F7.** Allow Users to Create, Edit, and Delete Their Own Reviews.
  - **F10.** Create, Edit, Delete Games as an Administrator.
  - **F11.** View a List of Users and Edit Roles as an Administrator.
  - **F12.** Moderate/Delete User Reviews as an Administrator.
## 14. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| … | L/M/H | L/M/H | … |

## 15. Rollout Plan

- Implement the registration and login flows against the development database and session store.
- Verify the session cookie settings and session lifecycle before connecting protected features.
- Enable the authentication pages and endpoints in the development environment after automated tests pass.
- Test the full registration, login, session restoration, and logout flows with representative accounts.
- No feature flag is required for a new application unless the team adopts feature flags as a project convention.
- No migration or backfill is expected unless implementation identifies missing fields or constraints in F1 or F2.
- Before deployment, configure HTTPS, secure cookies, session-store persistence, and rate limiting.
- If a deployment regression occurs, revert the application code to the last known working version and restore compatible configuration. Do not assume that clearing the session store is harmless; doing so will log out affected users.

## 16. Test Plan

- **Unit** — Validate email normalization and test password enforcement and verification
- **Integration** — Test registering accounts and verify duplicates are not created
- **End-to-end** — Verify session restoration after refreshing or revisiting application
- **Security** — Verify plain text passwords are not stored or logged
- **Accessibility** — Verify that accessibility checks pass
- **Performance / load** — Measure registration and login latency under expected workload
- **Manual exploratory** — Test registration and login with valid, invalid and boundary-length inputs

## 17. Documentation & Training

- Document registration, login, logout, and current-user API behavior.
- Document the password policy, email normalization rules, and authentication error responses.
- Document session-cookie settings and required production configuration.
- Document the distinction between authentication (identifying a user) and authorization (determining what that user may do).

## 18. Open Questions

1. What minimum password length and any additional password-complexity rules will the project require?
2. Will registration require email verification before an account can be used?
3. Should successful registration automatically log the user in, or should the user be redirected to the login page?
4. What session expiration policy should be used for inactivity and maximum session lifetime?
5. Which password-hashing library and algorithm will be adopted?
6. What email-normalization policy will be used, particularly for case handling and whitespace?
7. What rate limits should apply to registration and login, and should repeated failures trigger temporary lockouts or additional challenges?
8. What request-origin and CSRF-protection strategy will be used with the session cookie?
9. What exact fields should the current-user endpoint return, and will the API use a consistent shared error-response schema?
10. Which frontend framework and testing tools will the project use?

## 19. References

- Related plans: `F1-set_up_user_database_model.md`
- Related plans: `F2-set_up_authentication_infrastructure.md`
- Related plans: `F7-allow_users_to_create_edit_and_delete_their_own_reviews.md`
- Related plans: `F10-create_edit_delete_games_as_an_administrator.md`
- Related plans: `F11-view_a_list_of_users_and_edit_roles_as_an_administrator.md`
- Related plans: `F12-moderate_delete_user_reviews_as_an_administrator.md`