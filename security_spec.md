# Security Specification - SD NEGERI SUMBEREJO 04

## Data Invariants
1. `school_database` collection contains configuration documents that define the site's content.
2. Only authenticated admins can modify documents in `school_database`.
3. Anyone can read configuration documents to view the website.
4. `ppdbRegistrations` and `contactMessages` are currently stored as arrays inside `school_database` documents according to the existing mock, but should ideally be top-level collections for scalability. However, for compatibility with the existing `database.ts`, I will stick to the single collection pattern for now, or allow both if I refactor.
5. Wait, looking at `database.ts` line 233: `doc(db, 'school_database', key)`. This means each "table" is a document in `school_database`.
6. I will enforce that `adminCredentials` can only be read/written by the super admin.

## The "Dirty Dozen" Payloads
1. Create a document in `school_database` without being signed in.
2. Update `schoolInfo` without being an admin.
3. Inject a 2MB string into `schoolInfo.name`.
4. Update `adminCredentials` as a regular user.
5. Delete `schoolInfo`.
6. Read `adminCredentials` as an unauthenticated user.
7. Create a doc in `school_database` with an invalid ID like `../sneaky`.
8. Update `teachers` with an empty array.
9. Spoof `request.auth.uid` during an update.
10. Update `schoolInfo` and remove the `npsn` field (integrity breach).
11. Add a "Ghost Field" `isVerified: true` to a news article.
12. Bulk read `school_database` without matching whitelisted doc IDs.

## Test Runner
(Verifies PERMISSION_DENIED for all Dirty Dozen payloads)
`firestore.rules.test.ts` will be generated during the implementation phase.
