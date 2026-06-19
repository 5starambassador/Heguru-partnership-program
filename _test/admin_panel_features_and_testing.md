# Heguru Admin Panel: Sidebar Menu Items, Features, & Manual Testing Guide

This document lists all the individual pages in the Heguru Admin and Superadmin panels, breaks down their core features (including Excel/CSV bulk uploading, reports generation, direct student registration, and data syncing), and provides step-by-step manual testing instructions for each.

---

## 📋 List of Individual Pages in the Admin Panel

The admin sidebar displays the following pages dynamically based on the logged-in administrator's role and permission settings:

1. **Home / Dashboard**: Central control hub `/superadmin`, `/admin`, `/finance`, or `/campus`.
2. **Analytics**: Detailed system-wide growth metrics and distribution charts.
3. **Campus Control**: Creation, deactivation, and grading configurations for school/college campuses.
4. **User Operations**: Active/Archived ambassador profiles, bank accounts, and incentive levels.
5. **Student Records**: Master student directory, direct student registration, fee backfilling, and fee mismatch logs.
6. **Admin Management**: Executive and campus head account creation and credential refinement.
7. **Reports**: Core export center for high-volume CSV data, trend analysis, and email reporting.
8. **Referral Pipeline**: Tracking, confirming, rejecting, or converting referral leads.
9. **Fee Management**: Campus-grade fee matrices (One-Time and Installment structures).
10. **Engagement Center**: Automated communication rules and WhatsApp campaign builders.
11. **External Programs**: Special courses or partnership modules catalog.
12. **Program Leads**: Intake pipeline for external programs and college admissions.
13. **Beneficiary Verification**: Verification queue for parents/staff claiming child fee benefits.
14. **Marketing Management**: Central repository for social media banner distribution.
15. **Revenue & Payouts / Settlements**: Settlement calculator, payouts processor, and star milestone configuration.
16. **Access Control**: Role-based access control (RBAC) permission grid toggles.
17. **Settings**: Core configuration variables, security restrictions, IP whitelists, and database backups.
18. **Benefit Management**: Interactive tier and reward logic setup.
19. **Payment Approvals**: Queue to verify manual QR-code payment proofs (UTRs).
20. **Rejection History**: Archive of rejected payments and administrative remarks.
21. **Support Tickets**: Help desk cases escalation list.
22. **Finance Ledger**: Multi-tab records for registration fees, waivers (Group A), and payouts (Group B).
23. **Audit Trail**: Chronological event logs for administrative transparency.
24. **Profile**: Secure credential updating and personal data panel.

---

## 🔍 Detailed Features & Test Cases for Each Page

### 1. Home / Dashboard (`/superadmin`, `/admin`, `/finance`, `/campus`)
*   **Core Features:**
    *   **Data Sync Repair Banner:** Displays a warning if confirmed leads are missing from the master student database, with a "Repair Records Now" button to sync them.
    *   **KPI Widgets:** Real-time metrics for Total Ambassadors, Leads, Confirmed, Conversion Rate, and System-Wide Benefits.
    *   **Global Filters:** Filter by Academic Year and Student Source (Referral, Organic, or All).
*   **How to Test:**
    1.  Log in as a Super Admin/Admin.
    2.  Check if the top warning banner "Data Sync Required" appears when there are un-synced students.
    3.  Click "Repair Records Now". Verify a success toast appears and the banner disappears.
    4.  Change the Academic Year filter (e.g., `2025-2026`) and Student Source filter. Verify stats cards update accordingly.

### 2. Analytics Dashboard (`?view=analytics`)
*   **Core Features:**
    *   **Growth Trend Charts:** Visualizes user registration growth over time.
    *   **Conversion Funnel:** Shows ratios from New leads -> Contacted -> Interested -> Confirmed -> Admitted.
    *   **Campus Comparison Matrix:** Performance breakdown by campus name, showing total leads, confirmed counts, and conversion percentages.
    *   **Ambassador Role Distribution:** Pie chart showing parent, staff, alumni, and others ratio.
*   **How to Test:**
    1.  Navigate to the Analytics page.
    2.  Verify the charts and comparative tables render correctly with no broken indicators.
    3.  Hover over charts to check tooltips showing precise numbers.
    4.  Compare the figures on the charts with database totals to ensure mathematical consistency.

### 3. Campus Control (`/superadmin/campuses` or `?view=campuses`)
*   **Core Features:**
    *   **CRUD Operations:** Add, Edit, and Delete school or college campuses.
    *   **Interactive Grade Selection:** Select standard grades (Pre-Mont to Grade 12) or type in custom college courses (e.g. B.Tech, MBA).
    *   **Deactivate Campus:** Toggle campus status to prevent new user sign-ups or admissions.
    *   **Force Delete Logic:** Blocks standard deletion if campus contains students; prompts Super Admin for a force-delete confirmation which deletes all cascading student tables.
*   **How to Test:**
    1.  Click **Add New Campus**. Enter Name (e.g. `ASM-COIMBATORE`), Code (`COIM-01`), and select grades. Save it.
    2.  Locate the created campus in the grid and click **Edit**. Add a custom course tag (e.g., `B.Tech EEE`) and press Enter to save.
    3.  Toggle the status switch to Deactive. Verify a modal warning pops up asking to confirm.
    4.  Click **Delete** on a campus with registered students. Verify the warning dialog demands a confirmation to "Force Delete" before deleting.

### 4. User Operations (`/superadmin/users` or `?view=users`)
*   **Core Features:**
    *   **Active vs Archived Tab:** Separates current ambassadors from deleted users (archived to recycle mobile numbers).
    *   **Add/Edit Ambassador Modal:** Detailed forms covering Identity, Role-specific details (Assigned campus, working employee ID, child studying in Heguru details), Bank Information (Bank, Account No, IFSC Code), and Custom Benefit slab overrides.
    *   **Bulk Ambassador Upload:** Upload high-volume users via a downloadable CSV template.
    *   **Access Credentials Reset:** Direct password resets for any ambassador.
    *   **Permanent Purge:** Super Admin exclusive action to fully delete records from the DB instead of archiving.
*   **How to Test:**
    1.  Click **Add New Ambassador**. Select Role: `Staff`, check `My Child is studying in Heguru` box. Enter child details (Name, Grade, ERP No) and Bank information. Save.
    2.  Verify the user appears in the table. Click **Archived** tab, toggle back to **Active**.
    3.  Click **Bulk Upload**. Click "Download template". Populate the template with dummy rows, drag the file into the upload zone, and click "Initiate System Injection". Verify success status and a downloadable processing feedback CSV.
    4.  Click **Reset Password** on a user card. Enter a new password and verify the user can log in with it.

### 5. Student Records (`/superadmin/students` or `?view=students`)
*   **Core Features:**
    *   **Direct Student Registration:** Register a student by entering name, selecting an existing parent or clicking "Add New Parent" (which prompts name/mobile inputs), campus, grade, section, ERP number, academic year, and payment plan.
    *   **Fee Auto-Calculation:** Automatically sets base fee based on the selected campus, grade, and payment plan (WOTP vs OTP).
    *   **Bulk Students Upload:** Import students in bulk using a template.
    *   **Backfill Student Fees:** Recalculates base fees for all registered students against the current fee rules and downloads a CSV detailing any students missing a configured fee matrix.
    *   **Missing Fee Report:** Direct download of student records with missing fee configurations.
*   **How to Test:**
    1.  Click **Add New Student**. Enter Name, check **Add New Parent**, fill parent details, select Campus, Grade, and Payment Plan. Verify the "Base Fee" field auto-calculates. Click Save.
    2.  Click **Backfill Fees**. Wait for the engine to run. Verify a toast reports the updated count. If there are mismatches, verify a CSV download (`missing-gradefee-report.csv`) automatically triggers.
    3.  Verify clicking **Generate Report** triggers an immediate download of all students lacking configured fee details.

### 6. Admin Management (`?view=admins`)
*   **Core Features:**
    *   **Role Provisioning:** Onboard administrative accounts: Campus Head, Campus Admin, Admission Admin, Finance Admin, or Super Admin.
    *   **Campus Node Isolation:** Restricts Campus Heads and Campus Admins to a specific campus node dropdown selection.
*   **How to Test:**
    1.  Click **Onboard Executive**. Fill Name, Mobile, and select Role: `Campus Head`. Select assigned campus (e.g. `ASM-CHENNAI`). Save.
    2.  Log in as the newly created Campus Head. Verify they are redirected to `/campus` and can only see data belonging to `ASM-CHENNAI`.

### 7. Reports Center (`?view=reports`)
*   **Core Features:**
    *   **Multi-Report Exports:** Triggers download of 17 distinct CSV reports (Growth Trends, Leaderboards, Slab distributions, Churn risks, WhatsApp log history, and Payout calculations).
    *   **Administrative Filters:** Apply start/end dates, campus, and academic year filters to the generated reports.
    *   **Direct Emailing:** Deliver report documents directly to configured administrative email inboxes.
*   **How to Test:**
    1.  Select a date range, a campus, and Academic Year: `2025-2026`.
    2.  Locate "Top Performers" or "Master Pipeline" report and click **CSV**. Verify browser starts download of the filtered CSV file.
    3.  Click **Email** button on the same card. Verify a toast appears ("Email sent successfully").

### 8. Referral Pipeline (`/superadmin/referrals` or `?view=referrals`)
*   **Core Features:**
    *   **Excel-like Header Filters:** Multi-select filtering dropdowns built directly into table headers for Status, Role, Campus, and Plan.
    *   **WhatsApp Nudge Link:** Instant chat link next to student numbers prefilled with custom role-specific template outreach messages.
    *   **Bulk Status Toggles:** Check multiple rows to execute bulk confirmations, bulk rejections, or bulk student conversions.
*   **How to Test:**
    1.  Navigate to the Referral Pipeline.
    2.  Click the filter icon in the **Campus** header. Select a campus, click **Apply**. Verify only that campus's referrals load.
    3.  Check three pending referrals. Select **Bulk Actions** -> **Confirm Referrals**. Select fee plan. Execute and check that status moves to "Confirmed".
    4.  Click the WhatsApp icon next to a referral mobile. Verify it redirects to a `wa.me` URL with pre-populated message templates.

### 9. Fee Management (`?view=fees`)
*   **Core Features:**
    *   **Annual Fee Matrices:** Configure One-Time (OTP) and Installment (WOTP) fees per campus, grade, and year.
    *   **Bulk Upload & Template:** Ingest the whole fee structure database via CSV templates.
    *   **Fee Sync Utility:** Apply newly configured fees to existing student records in bulk.
*   **How to Test:**
    1.  Filter by Academic Year `2026-2027` and Campus.
    2.  Click **Sync Fees**. Confirm in the dialog. Verify student base fees align with the updated values.
    3.  Click **Bulk Upload**, select a updated fee structure CSV, and upload it. Verify entries update inside the table.

### 10. Engagement Center (`?view=engagement`)
*   **Core Features:**
    *   **Automated Rules Engine:** Build logic blocks that trigger SMS or WhatsApp templates based on event rules.
    *   **Campaign Builder:** Launch broadcast announcements or milestone notifications to specific ambassador segments.
*   **How to Test:**
    1.  Create a rule (e.g. "Trigger OTP message on new registration").
    2.  Submit a registration form on the public flow. Verify in logs/SMS service mock that the specific template triggers instantly.

### 11. External Programs (`?view=programs`) & 12. Program Leads (`?view=program-leads`)
*   **Core Features:**
    *   **Program Catalog:** Add/Edit courses outside regular school structure.
    *   **Leads Pipeline:** Catch admissions leads specifically interested in external programs, allowing custom status tracking.
*   **How to Test:**
    1.  Navigate to External Programs, add a course (e.g., "Abacus Academy").
    2.  Go to Program Leads, submit a lead with interests in "Abacus Academy". Verify lead appears in the table.

### 13. Beneficiary Verification Queue (`/superadmin/verification`)
*   **Core Features:**
    *   **Matching Suggestion Engine:** Automatically identifies potential matches from the ERP Master database based on parent mobile numbers or child ERP numbers (marked in blue/green).
    *   **Edit & Verify Override:** Verify and adjust details (child name, ERP no, campus, grade) directly from the queue cards before approving.
    *   **Auto-Verify Bulk Scanner:** One-click scan that automatically approves and promotes all pending verifications that match ERP database records exactly.
*   **How to Test:**
    1.  Identify a verification request card. Verify that if a mobile/ERP number matches the staged database, a match card with student details is suggested.
    2.  Click **Edit** on a card, adjust the Grade to Grade 2, and click **Approve & Promote**. Verify the user's status shifts to Active and a Student record is created in the db.
    3.  Click **Auto-Verify**. Confirm the scanner run. Check that exact matches disappear from the pending queue.

### 14. Marketing Management (`?view=marketing`)
*   **Core Features:**
    *   **Asset Repository:** Upload and distribute referral marketing banners, customizable overlays, or promo files to the ambassador promo kit page.
*   **How to Test:**
    1.  Upload an image asset. Fill title and description. Save.
    2.  Log in as a standard ambassador, navigate to **Promo Kit**, and verify the newly uploaded banner is downloadable.

### 15. Revenue & Payouts (`?view=settlements`) & 18. Benefit Management (`/superadmin/benefits`)
*   **Core Features:**
    *   **Settlement Calculator Modal:** Select an ambassador, choose calculation metrics, view calculated milestone yields, and draft a payout file.
    *   **Benefit Slab CRUD:** Configure star slab thresholds (e.g. 5 referrals = Gold tier, 10 referrals = Platinum tier) and set the waiver/cash benefit percentages.
*   **How to Test:**
    1.  Open **Settlement Calculator**. Select an ambassador with accrued commissions. Click Calculate and verify the yield breakdown displays.
    2.  Submit the calculation to generate a payout ledger item.
    3.  Add/Edit a benefit slab in the benefit slabs list. Verify updated slab metrics apply to new calculations.

### 16. Access Control (`?view=permissions`)
*   **Core Features:**
    *   **RBAC Permissions Matrix:** Clickable checkbox matrix mapping roles (Campus Head, Finance Admin, etc.) to feature modules (analytics, user management, settlements, etc.).
    *   **Reset Defaults:** Reverts role access rules to system default settings.
*   **How to Test:**
    1.  Uncheck `analytics` access for the `Admission Admin` role and click **Save**.
    2.  Log in as an Admission Admin. Verify they cannot see the Analytics sidebar menu item.
    3.  Go back, click **Reset to Default** for `Admission Admin`, and save. Verify the access is restored.

### 17. Settings (`?view=settings`)
*   **Core Features:**
    *   **Security Controls:** Enforce IP whitelists and 2FA verification for administrators.
    *   **Backup & Restore:** Generate system database backups and restore from backup files.
*   **How to Test:**
    1.  Enter an IP under the whitelist field. Try accessing `/superadmin` from an unauthorized IP and verify redirection to `/unauthorized-ip`.
    2.  Click **Backup Database**. Verify a sql/json file downloads.

### 19. Payment Approvals (`/superadmin/approvals`) & 20. Rejection History
*   **Core Features:**
    *   **UTR Verification:** Review manual payments containing UTR codes and payment slips.
    *   **Approve / Reject Actions:** Approve (promotes user status to Active) or Reject (promotes user status to Rejected, sends custom email/SMS with admin remark details).
*   **How to Test:**
    1.  Log in as a user, choose manual payment QR code, enter UTR number.
    2.  Log in as Admin, navigate to approvals queue. Verify the UTR card appears.
    3.  Click **Reject**, write "Invalid UTR". Verify the payment shifts to history and the user receives a warning notification on login.

### 21. Support Tickets (`/tickets`)
*   **Core Features:**
    *   **Level 4 Escalation Toast:** Automated notifications warning admins of urgent escalated cases.
    *   **Ticket Lifecycle:** Change status from open -> assigned -> resolved.
*   **How to Test:**
    1.  Create a ticket under an ambassador profile and escalate it to urgent.
    2.  Log in as an admin. Verify a toast appears at the top corner alerting about the Level 4 escalation.

### 22. Finance Ledger (`/finance`)
*   **Core Features:**
    *   **Strict Isolation Tabs:** Segregated lists for Registrations, Accrued Payout Liabilities (Group B), and Accrued Waivers (Group A).
    *   **Refund Integration:** Displays refund statuses with direct "Ready for Refund" badge notifications.
    *   **Gateway Manual Refresh:** "Sync Cashfree" button to manually pull down pending/stuck gateway transactions.
*   **How to Test:**
    1.  Open the Finance portal. Click **Sync Cashfree**. Verify a toast displays the processed count.
    2.  Check **Group A Ledger**. Verify waivers match the student discounts database.

### 23. Audit Trail (`?view=audit`)
*   **Core Features:**
    *   **Transparency Log:** Administrative activity feeds showing actor, timestamp, action type, and metadata changes.
*   **How to Test:**
    1.  Perform an action (e.g. edit a campus detail).
    2.  Navigate to the Audit Trail. Verify an entry has been added matching the edit.
