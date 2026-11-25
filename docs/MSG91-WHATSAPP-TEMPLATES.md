# MSG91 WhatsApp Templates — Heguru Partnership Program

As of 2026-11-16. Covers the 21 templates still to create. Paste each one into **MSG91 → WhatsApp → Templates → Create Template**.

---

## Rules before you start

- **Template name must match exactly.** The app looks templates up by name (`src/app/whatsapp-config-actions.ts`).
- **Language:** English (`en`) for all.
- **Category:**
  - `AUTHENTICATION` for OTPs
  - `UTILITY` for transactional alerts (a confirmation or status update the user triggered)
  - `MARKETING` for nudges and promotions

  Meta re-categorises or rejects a template whose content doesn't fit its category.
- **Variables** `{{1}}`, `{{2}}` … are listed in the exact order the app sends them. The number of variables in the body **must equal** what the app sends, or the message fails.
- **Body rules:** don't start or end the body with a variable, don't put two variables side by side, and stay under 1024 characters.
- **Sample values:** MSG91 or Meta asks for an example per variable. Use the samples given under each template.
- **Footer** (optional, max 60 characters): `Heguru India Partnership Program`

### Not included
| Template | Reason |
|---|---|
| `partners_registration_otp`, `partners_forgot_password_otp` | Already created |
| `kyc_reminder`, `kyc_approved`, `kyc_rejected` | No KYC in the flow |
| `payment_reminder` | No registration payment |

### Code mismatches (fix the config later)
In these templates, `requiredVariablesCount` in `whatsapp-config-actions.ts` doesn't match what the code actually sends. **The templates below follow the code**, because the code decides what is sent. Update the config counts to match.

| Template | Config says | Code sends |
|---|---|---|
| `settlement_processed` | 2 | 1 |
| `referral_reminder` | 1 | 2 |
| `referral_motivation` | 2 | 3 |
| `ambassador_program_nudge` | 2 | 3 |
| `program_launch_v1` | 1 | 2 |
| `admin_daily_digest` | 0 | 5 |

### Two other things to know
1. **`welcome_message` won't fire.** It's only sent from `src/app/api/payment/verify/route.ts`, after a registration payment. With no payment step, nothing triggers it. Either move the call to the point where registration completes, or skip this template.
2. **`welcome_drip_day1` sends a placeholder link.** `src/lib/reminder-service.ts` passes `https://youtu.be/example`. Replace it with your real video link before approving the template.

---

## 1. Onboarding

### 1.1 `welcome_message`
- **Category:** UTILITY
- **Variables:** 2 — `{{1}}` referral code, `{{2}}` referral link
- **Samples:** `{{1}}` = `HEG1234`, `{{2}}` = `https://partner.heguruindia.com/r/HEG1234`

```
Welcome to the Heguru Partnership Program! 🎉

Your account is now active. Your personal referral code is {{1}}.

Share your referral link with friends and family to start earning rewards:
{{2}}

Thank you for being part of the Heguru family.
```
Footer: `Heguru India Partnership Program`

---

### 1.2 `welcome_drip_day1`
- **Category:** MARKETING
- **Variables:** 1 — `{{1}}` video link
- **Sample:** `{{1}}` = `https://youtu.be/your-video-id`

```
Hello from Heguru! 👋

Here's a quick video showing how Heguru's right-brain education helps children learn faster and remember more:
{{1}}

Watch it and share it with parents who'd love to know more.
```
Footer: `Heguru India Partnership Program`

---

### 1.3 `welcome_drip_day3`
- **Category:** MARKETING
- **Variables:** 1 — `{{1}}` ambassador name
- **Sample:** `{{1}}` = `Priya`

```
Hi {{1}}, a quick tip for you! 💡

Most of our top ambassadors start by sharing Heguru with their own family and close friends. A personal recommendation goes a long way.

Open the app to share your referral link today.
```
Button (optional): URL → `Open App` → `https://partner.heguruindia.com`

---

## 2. Referral flow

### 2.1 `referral_otp`
- **Category:** AUTHENTICATION
- **Variables:** 1 — `{{1}}` OTP
- **Sample:** `{{1}}` = `4821`

Meta fixes the body text for Authentication templates, so you only pick options in MSG91:
- Code delivery: **Copy code** button
- Add security recommendation: **Yes**
- Code expiry: **Yes, 10 minutes** (match your actual OTP expiry)

Resulting message:
```
{{1}} is your verification code. For your security, do not share this code.
This code expires in 10 minutes.
```
Button: `Copy code`

---

### 2.2 `referral_added_ambassdor`
> Keep the spelling `ambassdor` exactly as written. It's what the code expects.

- **Category:** UTILITY
- **Variables:** 3 — `{{1}}` ambassador name, `{{2}}` parent name, `{{3}}` campus name
- **Samples:** `{{1}}` = `Priya`, `{{2}}` = `Ramesh Kumar`, `{{3}}` = `Anna Nagar`

```
Hi {{1}}, great news! ✅

Your referral for {{2}} has been submitted successfully to the {{3}} campus.

Our team will contact them shortly. You can track the status in your dashboard.
```
Footer: `Heguru India Partnership Program`

---

### 2.3 `referral_message_to_referralparent`
- **Category:** UTILITY
- **Variables:** 3 — `{{1}}` parent name, `{{2}}` ambassador name, `{{3}}` campus name
- **Samples:** `{{1}}` = `Ramesh Kumar`, `{{2}}` = `Priya`, `{{3}}` = `Anna Nagar`

```
Hello {{1}},

{{2}} has recommended Heguru for your child. Thank you for your interest! 🙏

Our team from the {{3}} campus will reach out to you soon to share details about our programs and arrange a visit.
```
Footer: `Heguru India Partnership Program`

---

### 2.4 `referral_confirmed`
- **Category:** UTILITY
- **Variables:** 2 — `{{1}}` parent name, `{{2}}` total confirmed referrals
- **Samples:** `{{1}}` = `Ramesh Kumar`, `{{2}}` = `3`

```
Congratulations! 🎉

Your referral {{1}} has been confirmed. You now have {{2}} confirmed referrals.

Keep sharing to unlock more rewards. Check your dashboard for details.
```
Footer: `Heguru India Partnership Program`

---

### 2.5 `referral_reminder`
- **Category:** MARKETING
- **Variables:** 2 — `{{1}}` ambassador name, `{{2}}` referral code
- **Samples:** `{{1}}` = `Priya`, `{{2}}` = `HEG1234`

```
Hi {{1}}, you haven't made your first referral yet! 🌟

Share your code {{2}} with friends and family whose children could benefit from Heguru.

Your first referral is just one message away.
```
Button (optional): URL → `Refer Now` → `https://partner.heguruindia.com`

---

### 2.6 `referral_motivation`
- **Category:** MARKETING
- **Variables:** 3 — `{{1}}` ambassador name, `{{2}}` current referral count, `{{3}}` referrals left to next level
- **Samples:** `{{1}}` = `Priya`, `{{2}}` = `2`, `{{3}}` = `3`

```
Hi {{1}}, you're doing great! 🚀

You have {{2}} referrals so far. Just {{3}} more to reach the next star level and unlock bigger rewards.

Keep going!
```
Button (optional): URL → `Refer Now` → `https://partner.heguruindia.com`

---

### 2.7 `referral_followup`
- **Category:** UTILITY
- **Variables:** 2 — `{{1}}` ambassador name, `{{2}}` parent name
- **Samples:** `{{1}}` = `Priya`, `{{2}}` = `Ramesh Kumar`

```
Hi {{1}},

Your referral {{2}} is still pending. A quick personal call or message from you can help them take the next step.

Check the latest status in your dashboard.
```
Footer: `Heguru India Partnership Program`

---

### 2.8 `five_star_achievement`
- **Category:** UTILITY
- **Variables:** 1 — `{{1}}` ambassador name
- **Sample:** `{{1}}` = `Priya`

```
Congratulations {{1}}! ⭐⭐⭐⭐⭐

You've reached 5-Star Ambassador status. Thank you for helping so many families discover Heguru.

Open your dashboard to see your new benefits.
```
Footer: `Heguru India Partnership Program`

---

## 3. Profile and payouts

### 3.1 `bank_details_missing`
- **Category:** UTILITY
- **Variables:** 1 — `{{1}}` ambassador name
- **Sample:** `{{1}}` = `Priya`

```
Hi {{1}},

Your bank account details are missing from your profile. Please add them so we can transfer your referral rewards without delay.

Go to Profile → Bank Details in the app.
```
Footer: `Heguru India Partnership Program`

---

### 3.2 `child_details_missing`
- **Category:** UTILITY
- **Variables:** 1 — `{{1}}` parent name
- **Sample:** `{{1}}` = `Ramesh Kumar`

```
Hi {{1}},

Your child's details and campus are not yet added to your profile. Please complete them so we can serve you better.

Go to Profile in the app to update.
```
Footer: `Heguru India Partnership Program`

---

### 3.3 `settlement_processed`
- **Category:** UTILITY
- **Variables:** 1 — `{{1}}` amount (already formatted, e.g. `5,000`)
- **Sample:** `{{1}}` = `5,000`

```
Good news! 💰

Your referral reward of ₹{{1}} has been processed and transferred to your registered bank account.

It may take 1–2 working days to reflect. Thank you for being a Heguru ambassador!
```
Footer: `Heguru India Partnership Program`

---

## 4. Programs

### 4.1 `program_launch_v1`
- **Category:** MARKETING
- **Variables:** 2 — `{{1}}` program title, `{{2}}` program link
- **Samples:** `{{1}}` = `Summer Brain Camp 2026`, `{{2}}` = `https://partner.heguruindia.com/programs/summer-camp`

```
New program launched! 🎊

We're excited to introduce {{1}}. Share it with parents in your circle and earn rewards for every registration.

Details and your share link: {{2}}
```
Footer: `Heguru India Partnership Program`

---

### 4.2 `program_browse_abandon`
- **Category:** MARKETING
- **Variables:** 2 — `{{1}}` program title, `{{2}}` program link
- **Samples:** `{{1}}` = `Summer Brain Camp 2026`, `{{2}}` = `https://heguruindia.com/summer-camp`

```
Still thinking about it? 🤔

You recently looked at {{1}}. Seats are filling up, so secure your child's spot today.

Register here: {{2}}
```
Footer: `Heguru India Partnership Program`

---

### 4.3 `ambassador_program_nudge`
- **Category:** UTILITY
- **Variables:** 3 — `{{1}}` ambassador name, `{{2}}` friend's name, `{{3}}` program title
- **Samples:** `{{1}}` = `Priya`, `{{2}}` = `Anitha`, `{{3}}` = `Summer Brain Camp 2026`

```
Hi {{1}},

Your friend {{2}} showed interest in {{3}} but hasn't registered yet.

A quick message from you could help them decide!
```
Footer: `Heguru India Partnership Program`

---

### 4.4 `program_registration_success`
- **Category:** UTILITY
- **Variables:** 2 — `{{1}}` program title, `{{2}}` program link
- **Samples:** `{{1}}` = `Summer Brain Camp 2026`, `{{2}}` = `https://heguruindia.com/summer-camp`

```
Congratulations! 🎉

Your registration for {{1}} is confirmed. We look forward to seeing your child.

Program details: {{2}}
```
Footer: `Heguru India Partnership Program`

---

### 4.5 `ambassador_program_success`
- **Category:** UTILITY
- **Variables:** 2 — `{{1}}` friend's name, `{{2}}` program title
- **Samples:** `{{1}}` = `Anitha`, `{{2}}` = `Summer Brain Camp 2026`

```
Great news! 🎉

Your referral {{1}} has successfully registered for {{2}}.

Your reward will be updated in your dashboard. Thank you for spreading the word!
```
Footer: `Heguru India Partnership Program`

---

## 5. Support

### 5.1 `ticket_response`
- **Category:** UTILITY
- **Variables:** 1 — `{{1}}` ticket subject
- **Sample:** `{{1}}` = `Referral not showing in dashboard`

```
Hello,

Our support team has replied to your ticket: "{{1}}".

Open the app to view the response.
```
Footer: `Heguru India Partnership Program`

---

## 6. Admin

### 6.1 `admin_daily_digest`
- **Category:** UTILITY
- **Variables:** 5 — `{{1}}` date, `{{2}}` new users, `{{3}}` active sessions, `{{4}}` new leads, `{{5}}` revenue
- **Samples:** `{{1}}` = `16 Nov`, `{{2}}` = `12`, `{{3}}` = `45`, `{{4}}` = `8`, `{{5}}` = `0`

> With no registration payment, revenue will mostly be `0`. To drop it, remove the 5th value in `src/lib/reminder-service.ts` (around line 585) and delete the last line below.

```
Daily summary for {{1}} 📊

New users: {{2}}
Active sessions: {{3}}
New leads: {{4}}
Revenue: ₹{{5}}

Open the admin panel for full details.
```
Footer: `Heguru India Partnership Program`

---

## Submission checklist (in priority order)

- [ ] `referral_otp` — the lead form likely depends on it
- [ ] `referral_added_ambassdor`
- [ ] `referral_message_to_referralparent`
- [ ] `referral_confirmed`
- [ ] `settlement_processed`
- [ ] `bank_details_missing`
- [ ] `ticket_response`
- [ ] `five_star_achievement`
- [ ] `program_registration_success`, `ambassador_program_success`
- [ ] `admin_daily_digest`
- [ ] Marketing nudges: `welcome_drip_day1`, `welcome_drip_day3`, `referral_reminder`, `referral_motivation`, `referral_followup`, `child_details_missing`, `program_launch_v1`, `program_browse_abandon`, `ambassador_program_nudge`
- [ ] `welcome_message` — only after the trigger is moved off payment verification
- [ ] After approval, update `requiredVariablesCount` in `whatsapp-config-actions.ts` for the 6 mismatches above
