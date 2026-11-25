# MSG91 WhatsApp Templates — Heguru Partnership Program

Live already: `partners_registration_otp`, `partners_forgot_password_otp`.

Create each template below in **MSG91 → WhatsApp → Templates → Create Template**.
- **Title** = template name. Enter it exactly as written, because the app looks templates up by name. Recipients never see the title.
- **Language:** English (`en`)
- **Footer (optional):** `Heguru Partnership Program`
- Sample values for each variable are listed after the message.

No registration fee, no KYC: payment and KYC templates (`welcome_message`, `payment_reminder`, `kyc_reminder`, `kyc_approved`, `kyc_rejected`) are left out. Referral rewards are paid to partners by UPI only.

| # | Title | Category | Variables |
|---|---|---|---|
| 1 | `welcome_drip_day1` | MARKETING | 1 |
| 2 | `welcome_drip_day3` | MARKETING | 1 |
| 3 | `referral_otp` | AUTHENTICATION | 1 |
| 4 | `referral_added_ambassdor` | UTILITY | 3 |
| 5 | `referral_message_to_referralparent` | UTILITY | 3 |
| 6 | `referral_confirmed` | UTILITY | 2 |
| 7 | `referral_reminder` | MARKETING | 2 |
| 8 | `referral_motivation` (paused, not created; call commented out in `reminder-service.ts`) | MARKETING | 3 |
| 9 | `referral_followup` | UTILITY | 2 |
| 10 | `five_star_achievement` | UTILITY | 1 |
| 11 | `bank_details_missing` | UTILITY | 1 |
| 12 | `child_details_missing` | UTILITY | 1 |
| 13 | `settlement_processed` | UTILITY | 1 |
| 14 | `program_launch_v1` | MARKETING | 2 |
| 15 | `program_browse_abandon` | MARKETING | 2 |
| 16 | `ambassador_program_nudge` | UTILITY | 3 |
| 17 | `program_registration_success` | UTILITY | 2 |
| 18 | `ambassador_program_success` | UTILITY | 2 |
| 19 | `ticket_response` | UTILITY | 1 |
| 20 | `admin_daily_digest` | UTILITY | 4 |

---

## 1. welcome_drip_day1
**Category:** MARKETING

```
Hello from the Heguru Partnership Program! 👋

Here's a quick video showing how Heguru's right-brain education helps children learn faster and remember more:
{{1}}

Watch it and share it with parents who'd love to know more.
```
Samples: {{1}} `https://youtu.be/your-video-id`

---

## 2. welcome_drip_day3
**Category:** MARKETING

```
Hi {{1}}, a quick tip for you! 💡

Most of our top partners start by sharing Heguru with their own family and close friends. A personal recommendation goes a long way.

Open the app to share your referral link today.
```
Samples: {{1}} `Priya`

---

## 3. referral_otp
**Category:** AUTHENTICATION

Meta fixes the body for Authentication templates. Set these options in MSG91 (same as your live OTP templates):
- Code delivery: **Copy code** button
- Security recommendation: **Yes**
- Code expiry: **10 minutes**

```
{{1}} is your verification code. For your security, do not share this code.
This code expires in 10 minutes.
```
Samples: {{1}} `4821`

---

## 4. referral_added_ambassdor
**Category:** UTILITY. Keep the title spelling `ambassdor` exactly; the code uses it.

```
Hi {{1}}, great news! ✅

Your referral for {{2}} has been submitted successfully to the {{3}} campus.

Our team will contact them shortly. You can track the status in your Heguru Partnership Program dashboard.
```
Samples: {{1}} `Priya`, {{2}} `Ramesh Kumar`, {{3}} `Anna Nagar`

---

## 5. referral_message_to_referralparent
**Category:** UTILITY

```
Hello {{1}},

{{2}} has recommended Heguru for your child. Thank you for your interest! 🙏

Our team from the {{3}} campus will reach out to you soon to share details about our programs and arrange a visit.
```
Samples: {{1}} `Ramesh Kumar`, {{2}} `Priya`, {{3}} `Anna Nagar`

---

## 6. referral_confirmed
**Category:** UTILITY

```
Congratulations! 🎉

Your referral {{1}} has been confirmed. You now have {{2}} confirmed referrals.

Keep sharing to earn more referral rewards. Check your dashboard for details.
```
Samples: {{1}} `Ramesh Kumar`, {{2}} `3`

---

## 7. referral_reminder
**Category:** MARKETING

```
Hi {{1}}, you haven't made your first referral yet! 🌟

Share your code {{2}} with friends and family whose children could benefit from Heguru.

Your first referral is just one message away.
```
Samples: {{1}} `Priya`, {{2}} `HEG1234`

---

## 8. referral_motivation
**Category:** MARKETING

```
Hi {{1}}, you're doing great! 🚀

You have {{2}} referrals so far. Just {{3}} more to reach your next milestone in the Heguru Partnership Program.

Keep going!
```
Samples: {{1}} `Priya`, {{2}} `2`, {{3}} `3`

---

## 9. referral_followup
**Category:** UTILITY

```
Hi {{1}},

Your referral {{2}} is still pending. A quick personal call or message from you can help them take the next step.

Check the latest status in your dashboard.
```
Samples: {{1}} `Priya`, {{2}} `Ramesh Kumar`

---

## 10. five_star_achievement
**Category:** UTILITY. The title is fixed by the code; the message itself uses "Prestigious Partner", matching the in-app notification.

```
Congratulations {{1}}! 🌟

You've unlocked Prestigious Partner status in the Heguru Partnership Program. Thank you for helping so many families discover Heguru.

Your badge is now on your dashboard.
```
Samples: {{1}} `Priya`

---

## 11. bank_details_missing
**Category:** UTILITY

```
Hi {{1}},

Your UPI ID is missing from your profile. Please add it so we can send your referral rewards without delay.

Go to Profile in the app to update.
```
Samples: {{1}} `Priya`

---

## 12. child_details_missing
**Category:** UTILITY

```
Hi {{1}},

Your child's details and campus are not yet added to your profile. Please complete them so we can serve you better.

Go to Profile in the app to update.
```
Samples: {{1}} `Ramesh Kumar`

---

## 13. settlement_processed
**Category:** UTILITY

```
Good news! 💰

Your referral reward of ₹{{1}} has been sent to your registered UPI ID.

Thank you for being part of the Heguru Partnership Program!
```
Samples: {{1}} `5,000`

---

## 14. program_launch_v1
**Category:** MARKETING

```
New program launched! 🎊

We're excited to introduce {{1}}. Share it with parents in your circle and earn referral rewards for every registration.

Details and your share link: {{2}}
```
Samples: {{1}} `Summer Brain Camp 2026`, {{2}} `https://partner.heguruindia.com/programs/summer-camp`

---

## 15. program_browse_abandon
**Category:** MARKETING

```
Still thinking about it? 🤔

You recently looked at {{1}}. Seats are filling up, so secure your child's spot today.

Register here: {{2}}
```
Samples: {{1}} `Summer Brain Camp 2026`, {{2}} `https://heguruindia.com/summer-camp`

---

## 16. ambassador_program_nudge
**Category:** UTILITY. Title is fixed by the code; the message says "partner".

```
Hi {{1}},

Your friend {{2}} showed interest in {{3}} but hasn't registered yet.

A quick message from you could help them decide!
```
Samples: {{1}} `Priya`, {{2}} `Anitha`, {{3}} `Summer Brain Camp 2026`

---

## 17. program_registration_success
**Category:** UTILITY

```
Congratulations! 🎉

Your registration for {{1}} is confirmed. We look forward to seeing your child.

Program details: {{2}}
```
Samples: {{1}} `Summer Brain Camp 2026`, {{2}} `https://heguruindia.com/summer-camp`

---

## 18. ambassador_program_success
**Category:** UTILITY. Title is fixed by the code; the message says "partner".

```
Great news! 🎉

Your referral {{1}} has successfully registered for {{2}}.

Your referral reward will be updated in your dashboard. Thank you for spreading the word!
```
Samples: {{1}} `Anitha`, {{2}} `Summer Brain Camp 2026`

---

## 19. ticket_response
**Category:** UTILITY

```
Hello,

Our support team has replied to your ticket: "{{1}}".

Open the Heguru Partnership Program app to view the response.
```
Samples: {{1}} `Referral not showing in dashboard`

---

## 20. admin_daily_digest
**Category:** UTILITY

```
Daily summary for {{1}} 📊

New partners: {{2}}
Active sessions: {{3}}
New leads: {{4}}

Open the admin panel for full details.
```
Samples: {{1}} `16 Nov`, {{2}} `12`, {{3}} `45`, {{4}} `8`

---

## Code changes needed to match these templates

| Template | What to change |
|---|---|
| `admin_daily_digest` | `src/lib/reminder-service.ts` (~line 585) still sends a 5th value, revenue. Remove it, and set `requiredVariablesCount` to 4 in `src/app/whatsapp-config-actions.ts`. |
| `bank_details_missing` | `src/lib/reminder-service.ts` picks partners with a missing bank account number or IFSC. The database has no UPI field yet, so this needs a UPI ID field and the check switched to it. |
| `welcome_message` | Left out. Its only trigger is `src/app/api/payment/verify/route.ts` (registration payment), so it never fires. Disable it in WhatsApp settings. |
| `settlement_processed`, `referral_reminder`, `referral_motivation`, `ambassador_program_nudge`, `program_launch_v1` | `requiredVariablesCount` in `whatsapp-config-actions.ts` doesn't match what the code sends. Set it to 1, 2, 3, 3, 2 respectively. |
| `welcome_drip_day1` | `src/lib/reminder-service.ts` sends the placeholder `https://youtu.be/example`. Replace it with the real video link. |
