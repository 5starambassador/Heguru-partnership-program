# Heguru Partnership Program (HPP) — Manual Testing Checklist
This document provides a comprehensive, end-to-end manual testing checklist covering all features, endpoints, and user roles in the Heguru Partnership Application. Use this checklist to verify correctness, locate edge cases, and ensure a flawless product demonstration for your appraisal.

---

## 📋 Table of Contents
1. [User Roles and Permissions Overview](#-user-roles-and-permissions-overview)
2. [Phase 1: Onboarding, Authentication, & Payment Flows](#-phase-1-onboarding-authentication--payment-flows)
3. [Phase 2: Public Referral System (`/refer` and `/r/[code]`)](#-phase-2-public-referral-system-refer-and-rcode)
4. [Phase 3: Ambassador/Partner Panel (Ambassador Dashboard)](#-phase-3-ambassadorpartner-panel-ambassador-dashboard)
5. [Phase 4: Admin & Superadmin Operations Dashboard](#-phase-4-admin--superadmin-operations-dashboard)
6. [Phase 5: Manual Payment Approval Queue](#-phase-5-manual-payment-approval-queue)
7. [Phase 6: Beneficiary Verification System](#-phase-6-beneficiary-verification-system)
8. [Phase 7: Finance & Settlements Portal](#-phase-7-finance--settlements-portal)
9. [Phase 8: System Configurations, Security, & Integrity Check](#-phase-8-system-configurations-security--integrity-check)
10. [Phase 9: Cron Jobs, Webhooks, & Push Notifications](#-phase-9-cron-jobs-webhooks--push-notifications)

---

## 👥 User Roles and Permissions Overview
Verify system behaviors against these target user roles:
*   **Ambassador Roles:**
    *   `Parent` (with/without child in school)
    *   `Staff` (with/without child in school)
    *   `Alumni`
    *   `Others`
*   **Administrative Roles:**
    *   `Super Admin` (Full capabilities across all panels)
    *   `Finance Admin` (Access to Settlements, Waivers, Payouts, Registrations, and Refunds)
    *   `Campus Head` / `Campus Admin` (Campus-level tracking and student directory)
    *   `Admission Admin` (Access to shared approvals and referrals)

---

## 🔐 Phase 1: Onboarding, Authentication, & Payment Flows
This phase tests initial entry, OTP verification, registrations, membership fees, and redirects.

| Test ID | Test Scenario | Step-by-Step Instructions | Test Inputs / Data | Expected Outcome | Verification |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **AUTH-01** | Mobile Screen Entry | 1. Navigate to landing page.<br>2. Verify view on Desktop vs Mobile. | URL: `/` | 1. Desktop skips Welcome Screen (Step 0) and directly shows Mobile Entry.<br>2. Mobile shows Welcome Screen; clicks "Get Started" to see Mobile Entry. | UI Layout Verification |
| **AUTH-02** | OTP Generation (4-Digit) | 1. Enter a new/existing mobile number.<br>2. Click "Get OTP". | Phone: `9876543210` | 1. In Dev mode, toast displays the mock 4-digit OTP code.<br>2. In Prod mode, MSG91 triggers SMS.<br>3. Input fields limit input to exactly 4 digits. | Browser Console / Toast Message |
| **AUTH-03** | Rate Limiting (429) | 1. Request OTP / Attempt password login repeatedly (6+ times). | Mobile OTP requests | System blocks requests with HTTP 429 status and shows "Too many requests. Please try again later." toast. | Network Tab (Status 429) |
| **AUTH-04** | Password Login Flow | 1. Enter an existing mobile number.<br>2. Verify password form triggers.<br>3. Enter incorrect and correct credentials. | Valid user credentials | 1. Incorrect password triggers "Login Failed" toast.<br>2. Correct password redirects user to `/dashboard` (or admin page). | Redirect path matching role |
| **AUTH-05** | Registration Flow (New User) | 1. Enter new number & verify OTP.<br>2. Fill Basic Details (Name, Email, Password).<br>3. Select Role, Campus, and indicate if child is in Achariya.<br>4. Fill Child Details (Name, Grade, EPR/Admission No) if applicable. | Name: `Alex Doe`, Role: `Parent`<br>EPR No: `EPR12345` | Registration succeeds; User status is marked as `Pending` in database.<br>Redirects to secure payment page. | DB check: `User` table status = `Pending` |
| **AUTH-06** | Online Payment (Cashfree/GrayQuest) | 1. Choose Gateway (configured in Superadmin settings).<br>2. Click "Pay ₹25 Now". | Online mock sandbox payment | 1. Redirects to respective payment portal.<br>2. Successful payment updates user status to `Active` and redirects to `/dashboard`. | `Payment` table status = `SUCCESS`, `User` status = `Active` |
| **AUTH-07** | Offline Fallback (Manual QR) | 1. Fail/Cancel online payment to trigger smart fallback.<br>2. Click "Scan & Pay via QR Code" link.<br>3. Scan QR and transfer ₹25.<br>4. Enter 12-digit transaction ID (UTR). | UTR: `123456789012` | 1. 12-character alphanumeric regex enforces valid format.<br>2. Submitting manual payment proof sets User status to `Pending` and changes paymentStatus to `Pending Approval`. | Modal success message and page reload |
| **AUTH-08** | Unauthorized Redirection (Middleware) | 1. Log in as a `Pending` status user.<br>2. Attempt to navigate directly to `/dashboard`. | Direct URL: `/dashboard` | Middleware blocks access and redirects user back to `/?step=payment` (or `/complete-payment`). | Redirect execution check |

---

## 🔗 Phase 2: Public Referral System (`/refer` and `/r/[code]`)
This phase validates student referral generation, public links, and offline caching.

| Test ID | Test Scenario | Step-by-Step Instructions | Test Inputs / Data | Expected Outcome | Verification |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **REF-01** | Referral Code Decryption | 1. Navigate to short URL.<br>2. Verify redirection logic. | URL: `/r/ENC_CODE` | Redirection decrypts the referral code and forwards to `/refer?ref=DECRYPTED_CODE`. | URL bar query params |
| **REF-02** | Referral Link Flow Banner | 1. Access `/refer?ref=DECRYPTED_CODE`. | Valid Ambassador code | 1. Display a top gold banner showing referred ambassador's name.<br>2. Title shows "Join the Program". | UI Banner visibility check |
| **REF-03** | Security OTP (Link Flow) | 1. Enter parent mobile.<br>2. Click "Get OTP". | Phone: `9998887776` | System alerts that OTP has been sent *to the Referrer/Ambassador* for verification. Shows ambassador's name. | Onscreen instruction text |
| **REF-04** | Direct Form Flow (No Ref) | 1. Access `/refer` directly without query parameters. | Plain URL | 1. Gold banner does not display.<br>2. Title shows "Make a Referral".<br>3. OTP is sent *directly* to the parent's phone number. | Text differences check |
| **REF-05** | Form Validations & Dropdowns | 1. Verify Parent Name and Student Name inputs.<br>2. Select a Campus (e.g., Campus X).<br>3. Verify Grade dropdown updates. | Select Campus -> Verify Grade | Grade dropdown dynamically filters to show only the grades configured for the selected campus. | UI dropdown elements |
| **REF-06** | Offline Lead Capture | 1. Disable browser internet connection.<br>2. Complete the referral form.<br>3. Click "Submit Referral". | Offline network status | 1. System bypasses OTP check.<br>2. Lead is cached locally in browser IndexedDB.<br>3. Success message shows Tamil translation advising that syncing will occur when online. | IndexedDB inspection / toast check |
| **REF-07** | Offline Lead Sync | 1. Restore internet connection.<br>2. Verify background synchronization triggers. | Restore Network | Cached leads are automatically synced to the server; counts on ambassador dashboard update. | Network tab requests / DB check |

---

## 📊 Phase 3: Ambassador/Partner Panel (Ambassador Dashboard)
This phase tests statistics, payouts, pipeline displays, and profile completions.

| Test ID | Test Scenario | Step-by-Step Instructions | Test Inputs / Data | Expected Outcome | Verification |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **AMB-01** | Referral Link Generator | 1. Check home page of dashboard.<br>2. Click WhatsApp share option.<br>3. Copy referral link. | Active Ambassador Profile | 1. Link is generated in short format `/r/[code]`.<br>2. WhatsApp launches with role-specific text templates (Staff/Alumni/Parent). | Link correctness / Clipboard copy |
| **AMB-02** | Metrics Dashboard | 1. Review main statistics boxes. | Confirmed referrals: 3 | 1. Shows correct Confirmed Yield.<br>2. Displays active settlements.<br>3. Milestone progress bar updates based on multiples of 5. | Accuracy match with database counts |
| **AMB-03** | Pipeline: Pre-Asset vs Asset | 1. Open `/referrals` view. | Lead statuses | 1. Pending leads appear in **Pre-Asset**.<br>2. Confirmed, Admitted, or Rejected leads appear in **Asset**. | Placement correctness in UI lists |
| **AMB-04** | Pipeline Card Details | 1. Check pipeline card statuses, settled tags, and yields. | Referral statuses | 1. Confirmed leads show **Secured: ₹X** or **Settled: ₹X** tags.<br>2. Pending leads show **Potential: ₹X** tags.<br>3. Rejected leads show rejection reasons. | Alignment with calculating logic |
| **AMB-05** | WhatsApp Nudge Button | 1. Click the WhatsApp icon next to a referral lead card. | Lead details | Redirects to WhatsApp Web/App with a prefilled message addressing the parent regarding their child's status. | WhatsApp URL query parameters |
| **AMB-06** | Earnings Breakdown | 1. Open `/earnings` page.<br>2. View Breakdown blocks and Transaction History list. | Processed settlements | 1. Displays cards for waiver/credit payouts.<br>2. Lists transaction records with payout dates and bank reference codes. | Check values against `Settlement` DB records |
| **AMB-07** | Profile Completeness Reminder | 1. Clear bank account/IFSC details in profile.<br>2. View `/earnings` page with referrals > 0. | Blank bank details | Shows a warning banner: "Profile Readiness Required. Bank details missing. Click Complete Profile." | Banner visibility check |
| **AMB-08** | Profile Management | 1. Open `/profile`.<br>2. Update bank details & personal info.<br>3. Save details. | Bank: `123456`, IFSC: `FDRL0002514` | 1. Validates IFSC format.<br>2. Save action updates db records.<br>3. Readiness warning banner disappears. | Toast confirm and DB record check |

---

## 🛠️ Phase 4: Admin & Superadmin Operations Dashboard
This phase tests analytics, charts, maintenance utilities, and organic entries.

| Test ID | Test Scenario | Step-by-Step Instructions | Test Inputs / Data | Expected Outcome | Verification |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ADM-01** | Analytics Dashboard | 1. Log in as Admin / Super Admin.<br>2. Check main KPI cards (Total, Confirmed, Conversion). | Admin Credentials | 1. Values align with student entries.<br>2. Role distribution chart displays Parent/Staff ratios.<br>3. Top performers list maps correct metrics. | Value correlation with database |
| **ADM-02** | Target Repair/Sync Utilities | 1. View home page banner warning of missing database students.<br>2. Click "Sync All Records Now". | `missingStudentCount` > 0 | Synchronizes confirmed referral leads with the student master database. Warning banner disappears. | Toast success / check student table |
| **ADM-03** | Add Organic Student | 1. Click "Add Organic Student" button.<br>2. Fill details (Name, Campus, Grade, Section, Parent Details).<br>3. Save. | Name: `Tim Drake`, Grade: `Grade 2` | Student is added directly to database without referral codes. Appears under student directory. | Success toast and student table |
| **ADM-04** | User / Admin Management | 1. Navigate to Users / Admin Tab.<br>2. Search/filter records.<br>3. Update roles or edit details. | Search query / role change | User directory updates correctly. Searching fits multiple fields (name, mobile, EPR, Employee ID). | Check updated role inside DB |
| **ADM-05** | CSV Import Center | 1. Open CSV Bulk Uploader.<br>2. Select upload type (Students/Fees/Campuses/Leads).<br>3. Upload sample file. | Sample CSV data | 1. Validates columns.<br>2. Processes records in bulk.<br>3. Success stats and error summaries display. | Table rows additions in DB |
| **ADM-06** | Detailed Reports Export | 1. Navigate to `/superadmin?view=reports` / `/admin?view=reports`.<br>2. Generate & Download reports (Pipeline, Trends). | Click export buttons | Server generates CSV file and browser triggers download. | Content of downloaded CSV file |

---

## 📥 Phase 5: Manual Payment Approval Queue
This phase tests the approval and rejection mechanics for membership registration fees.

| Test ID | Test Scenario | Step-by-Step Instructions | Test Inputs / Data | Expected Outcome | Verification |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **PAY-01** | Approvals Dashboard | 1. Access `/superadmin/approvals`. | Pending QR payments | Lists all manual QR transaction proofs with transaction ID (UTR) and User Details. | Display matching pending payment table |
| **PAY-02** | Approve Manual Payment | 1. Select a payment entry.<br>2. Click "Approve". | Pending UTR request | 1. Payment status shifts to `SUCCESS`.<br>2. Associated User status shifts to `Active`.<br>3. Synced user stats and audit logs are updated. | UI list removal, DB checks |
| **PAY-03** | Reject Manual Payment | 1. Select a payment entry.<br>2. Click "Reject".<br>3. Provide a rejection reason. | Reason: "Invalid UTR number" | 1. Payment orderStatus shifts to `FAILED`.<br>2. User paymentStatus shifts to `Rejected`.<br>3. Audit log is recorded.<br>4. Custom warning notification is sent to user. | Toast success, user notification inbox |
| **PAY-04** | Bulk Action Payments | 1. Select multiple payments.<br>2. Execute bulk approve or bulk reject. | Multi-checkbox select | All selected payments process. Statuses update simultaneously. | UI list reload / bulk outcomes toast |
| **PAY-05** | Rejection History View | 1. Navigate to `/superadmin/approvals/history`. | Rejected payments list | Shows historical rejection records with admin remarks/rejection reasons. | UI display matching DB logs |

---

## 🔍 Phase 6: Beneficiary Verification System
This phase tests Parent-Child verification flows, ERP matching suggestions, and promotion rules.

| Test ID | Test Scenario | Step-by-Step Instructions | Test Inputs / Data | Expected Outcome | Verification |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **VER-01** | Match Suggestions | 1. Navigate to `/superadmin/verification`. | Users with `PendingVerification` | Displays suggested matches from existing Student DB (green) or ERP Staging data (blue) based on EPR No or Parent Mobile. | Verify labels on match cards |
| **VER-02** | Global Campus Resolution | 1. Observe a pending user registered as "Global/Unassigned".<br>2. Verify suggestion details. | Match suggestion from campus | If match exists, display pulls student's official campus and grade to correct unassigned fields. | UI card displays matching ERP campus |
| **VER-03** | Approve Verification (Promote) | 1. Click "Approve" on a verification card.<br>2. Verify detail overrides or save defaults. | EPR: `STU9876`, Grade: `Grade 1` | 1. Promotes User benefitStatus to `Active`.<br>2. Creates active Student record in database.<br>3. Calculates base fee and discount percentages. | Verification approved toast, Student database |
| **VER-04** | Discount Rules (First Child) | 1. Verify discount percent on student created for a first-time parent.<br>2. Add a second child for same parent. | Parent's 1st and 2nd child | 1. 1st student gets the configured benefit percentage discount (e.g., 10%).<br>2. 2nd student gets 0% discount (one-child-only benefit rule). | `discountPercent` values in `Student` DB |
| **VER-05** | Reject Verification | 1. Click "Reject" on verification card.<br>2. Provide rejection reason. | Reason: "Wrong EPR Number" | 1. User benefitStatus resets to `Inactive`.<br>2. User studentFee resets to 0.<br>3. Notification with rejection reason is sent. | DB check: status = `Inactive`, UI notification |
| **VER-06** | Bulk Verify Scanner | 1. Click "Bulk Verify against DB/Staging". | Multi matches available | Scanner auto-promotes all pending users who have matching EPR Numbers inside staging/student tables. | Toast summary showing match counts |

---

## 💳 Phase 7: Finance & Settlements Portal
This phase tests fee ledgers, waivers, payout reconciliations, and slab controls.

| Test ID | Test Scenario | Step-by-Step Instructions | Test Inputs / Data | Expected Outcome | Verification |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **FIN-01** | Registrations & Refund Badge | 1. Open `/finance` panel.<br>2. Observe active tab count badge. | Registrations ledger | 1. Lists registration fees.<br>2. "Ready for Refund" badge displays count of users eligible for registration refunds. | Badge count matching database |
| **FIN-02** | Process Payout Request | 1. Navigate to Payouts tab.<br>2. Process a pending payout request. | Payout ID / Bank Ref details | Payout shifts status to `Processed`. Payout details update with banking reference. | Payout success toast / check history tab |
| **FIN-03** | Waiver Group A Allocation | 1. Verify accrued list in `liabilities_a` tab. | Parents/Staff with Active child | Commission calculated is set aside as a waiver. Credited to child's fee ledger instead of cash payouts. | Database checks on waiver lists |
| **FIN-04** | Payout Group B Allocation | 1. Verify accrued list in `liabilities_b` tab. | Alumni/Others without child | Commission calculated is added to pending payout bank requests list. | Database check on settlements list |
| **FIN-05** | Settlement Calculator | 1. Open Settlement Calculator Modal.<br>2. Select user and calculate settlement. | Select user: Parent / Others | Calculates current accrued commissions, matches against milestones, and outputs final payout figures. | Modal breakdown displays values |
| **FIN-06** | Benefit Slab Configs (CRUD) | 1. Navigate to `/superadmin?view=settlements`.<br>2. Add, edit, or delete benefit slabs. | Slab count, reward percents | 1. CRUD actions update benefit logic rule variables.<br>2. Slabs table displays updated tiers. | UI layout update, database slab check |
| **FIN-07** | Group A Waiver Redemption Cycle | 1. Go to `/finance` -> **Liabilities - Group A (Waiver)** (`liabilities_a`) tab.<br>2. Locate parent with confirmed referral & note outstanding waiver balance.<br>3. Simulate posting credit voucher against child's fees in external school ERP.<br>4. In HPP, click **New Settlement Request**, select parent, input waiver amount.<br>5. Go to pending list, click **Process**, input **Credit Voucher ID** as `bankReference`. | Parent user, waiver amount, Voucher: `CR-ERP-991` | 1. Settlement status updates to `Processed`.<br>2. Waiver amount shifts to **Applied Credits** in Ambassador dashboard.<br>3. A new line-item of type `WAIVER` is appended to transaction history.<br>4. Referred student card displays blue `Settled` tag. | UI checks on finance/ambassador panel; DB updates on `Settlement` table |

---

## 🛡️ Phase 8: System Configurations, Security, & Integrity Check
This phase tests middleware routing protection, security headers, role access restrictions, and audit trails.

| Test ID | Test Scenario | Step-by-Step Instructions | Test Inputs / Data | Expected Outcome | Verification |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **SEC-01** | Middleware Access Check | 1. Log in as a standard Ambassador user.<br>2. Attempt to directly access `/superadmin` or `/admin`. | URL: `/superadmin` | System blocks entry and redirects user back to `/dashboard` immediately. | Redirect response matching middleware |
| **SEC-02** | Security Headers check | 1. Load any page.<br>2. Inspect response headers. | Developer Tools / Network tab | Headers: `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, and secure CSP settings are active. | Network response headers inspection |
| **SEC-03** | Interactive RBAC Matrix | 1. Open `/superadmin?view=permissions`.<br>2. Toggle a permission checkbox for a role.<br>3. Save permissions. | Toggle checkbox for role (e.g. Admission Admin) | Updates permission values. User session checks reflect updated access rights immediately. | Toast confirmation, check DB table |
| **SEC-04** | Audit Trail Log | 1. Perform an administrative action (e.g. verify user, change permission).<br>2. Navigate to Audit Trail tab (`/superadmin?view=audit`). | Administrative action | 1. Logs details of action (action type, admin actor, timestamp, metadata).<br>2. Item displays in audit list. | Audit log list update / check DB records |
| **SEC-05** | Neon Database Resiliency | 1. Allow the application's database compute pool to spin down to zero (cold state).<br>2. Execute a database query via page load or server action. | Dormant database state | 1. Application encounters transient latency check (~3-5s).<br>2. Retry wrapper (`withRetry` in [prisma.ts](file:///e:/heguru-partnership-application/src/lib/prisma.ts)) catches codes P1001/P2024 and retries.<br>3. Application loads database content smoothly without showing error pages. | DevTools network response / screen rendering |

---
## ⏰ Phase 9: Cron Jobs, Webhooks, & Push Notifications
This phase validates backend automated cron actions, external API webhooks, and push notification transport mechanisms.

| Test ID | Test Scenario | Step-by-Step Instructions | Test Inputs / Data | Expected Outcome | Verification |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CRON-01** | Daily Jobs Cron Trigger | 1. Send GET request to daily cron jobs endpoint.<br>2. Attempt request without authorization header.<br>3. Send request with valid cron secret header. | URL: `/api/cron/process-jobs`<br>Secret Header | 1. Request without header returns HTTP 401 Unauthorized.<br>2. Request with header returns HTTP 200 and processes automation rules. | Network HTTP response code |
| **CRON-02** | Rule Frequency Capping | 1. Configure an automation rule in rule builder.<br>2. Trigger `/api/cron/process-jobs` to run the rule once.<br>3. Re-run `/api/cron/process-jobs` within 24 hours. | Active Rule, target User | 1. First run executes rule action and logs to `AutomationLog` table.<br>2. Second run detects execution within cooldown and bypasses rule for that user. | DB check: check `AutomationLog` table entries |
| **CRON-03** | Daily Leads Sync Cron | 1. Send GET request with secret header to leads sync endpoint. | URL: `/api/cron/sync-leads` | Local student/lead lists sync with external school registry, correcting mismatches. | Check dashboard warning banner status |
| **WEB-01** | Payment Webhook Callback | 1. Simulate a success callback request from payment gateway (Cashfree/GrayQuest) to the webhook route. | URL: `/api/payment/verify`<br>Payload: `{ order_id: 'xyz', status: 'SUCCESS' }` | 1. Validates webhook request token.<br>2. Promotes payment to SUCCESS and updates user status to `Active` in database. | DB tables: `Payment` & `User` status check |
| **WEB-02** | Notification Webhook Callback | 1. Simulate delivery status callback from MSG91 to webhook endpoint. | URL: `/api/webhooks/whatsapp`<br>Payload: `{ msg_id: '991', status: 'DELIVERED' }` | updates target log status in `WhatsAppLog`/`SMSLog` table to `DELIVERED`. | DB check: status inside log table |
| **PUSH-01** | FCM Token Registration | 1. Build and launch mobile app (Capacitor wrapper).<br>2. Grant notification permission and load dashboard. | Active Capacitor device | 1. Prompts for notification permissions.<br>2. System obtains FCM token and saves it to the `fcmToken` column on the logged-in User. | DB check: User table `fcmToken` value |
| **PUSH-02** | Firebase Admin Push Send | 1. Perform an action that sends push alert (e.g. process a payout settlement). | Processed settlement | Firebase Admin SDK dispatches batch push payload to device FCM token. App wrapper displays push banner. | Device push notification tray display |

---

> [!IMPORTANT]
> **Demo Best Practices:**
> *   **Role Demonstration**: Prepare simulated dummy users in both Parent (Group A Waiver) and Alumni (Group B Cash Payout) roles to clearly demonstrate the difference in benefit allocation.
> *   **Waiver Audit Cycle**: Demonstrate the end-to-end Group A waiver loop by inputting credit voucher numbers during settlement processing and checking instant dashboard balance updates.
> *   **Data Sync & Resiliency**: Show the database reconnect resiliency under latency, and showcase the **Data Sync banner repair** on the admin dashboard, as data integrity is a major operational highlight of this system.
> *   **Offline Lead Capture**: Use the browser developer tools to demonstrate the **Offline capture feature** by toggling network status on/off in front of reviewers.
> *   **Automation Cron**: Trigger the daily cron endpoint manually using a tool like Postman or cURL to demonstrate rules engine evaluation and automated WhatsApp triggers live.
