# Reskilll upload — paste this

Use this file as the source of truth for the form. Do not wait on an Android phone.

## Fields to paste

**Project name:** MatchLoad

**Tagline:** Measuring in-match gaming load — so peak performance lasts longer than one clutch round.

**Track:** HealthTech (iQOO)

**One-paragraph pitch:**

> MatchLoad is a session-time wellness and ergonomics companion for mobile gamers. It scores *this match’s* musculoskeletal and arousal load — death-grip / micro-tremor spikes from high-rate motion, turtle-neck minutes from device pitch, and a 15-second between-round finger-on-lens recovery check — then coaches a reset in matchmaking (paced haptic breathe + one concrete tip such as “tilt the phone up”). It is not a next-morning report and not a medical device: no diagnosis, BP, ECG, or SpO2-as-medical claims. This upload is a mobile-first web prototype so judges (and a Mac-only team) can run the full Rahul BGMI story in a browser tonight; a later Kotlin port would bind the same UX to SensorManager, CameraX, and Vibrator.

**What you are uploading (pick one):**

1. **Repo URL (preferred):** After you click **Create repo** in Cursor (or push this project to GitHub/GitLab), paste the HTTPS URL. Example shape: `https://github.com/<you>/matchload`.
2. **Zip (if the form wants a file):** From this folder run `npm run build`, then zip the project (`matchload.zip` of the repo, *or* zip `dist/` plus this `SUBMISSION.md` / `README.md` if they only want the static preview). Do **not** upload an APK — there is no Android phone in the loop.

**How judges run it:**

```bash
git clone <your-repo-url>
cd <repo>
npm install
npm run dev
```

Open `http://localhost:43187` on a Mac browser. Click **Run Rahul’s BGMI demo**. No sensors, no login, no Android SDK.

Optional static preview: `npm run build && npm run preview`.

If the form also wants a live link, deploy the `dist/` folder to any static host (Vercel / Netlify / GitHub Pages) and paste that URL.

## 90-second demo script (matches the problem statement)

Speak this while the demo runs. Total story is ~68s of UI plus a few seconds on recap.

| Time | What you say | What they see |
| --- | --- | --- |
| 0:00 | “Rahul opens BGMI. MatchLoad is a *this-session* coach, not a morning report.” | Home → tap **Run Rahul’s BGMI demo**. Overlay arms, landscape lock. |
| 0:08 | “Pitch is already drifting flat — turtle-neck minutes start accumulating.” | Posture-time climbs. Status: looting / posture drifting. |
| 0:14–0:26 | “Firefight. High-rate motion reads as death-grip / micro-tremor. Four clutch spikes.” | Gauge goes hot. Event log shows four **CLUTCH SPIKE** lines. |
| 0:28 | “Compound clears. Overlay goes quiet mid-round so it does not nag during loot.” | HUD dims. Tremor eases. |
| 0:38 | “Queue is the only recovery window that fits. Haptic paced-breathe — vibration on phones that support it, visual pulse otherwise.” | Between-rounds breathe orb, inhale / hold / exhale. |
| 0:50 | “Fifteen seconds, finger on the rear camera. Simulated PPG. Not ECG, not BP, not medical SpO2.” | Viewfinder + flash pulse. HR settles 94 → 81. |
| 1:08 | “Recap: 4 spikes, 6.4 minutes in bad pitch, recovery delta minus 13, one tip — tilt the phone up.” | Recap screen. Point at the disclaimer. |

If you are short on time, tap **Jump to recap** after the firefight and still hit spikes / posture / HR / tip.

## Claims you must not make on stage

- Not a diagnostic, not a medical device
- Not blood pressure, ECG, or medical oxygen saturation
- Not disease detection
- Demo values are scripted; live-ish values are device-motion proxies

## Hardware the form might ask about

| Signal in the problem statement | In this prototype | Later Android port |
| --- | --- | --- |
| Gyro / accel tremor + landscape lock | Scripted in demo; DeviceMotion magnitude in live-ish | `SensorManager` |
| Device pitch / turtle-neck | Scripted + DeviceOrientation beta | Rotation vector |
| Rear camera + flash PPG | 15s simulated finger-hold UI (optional camera preview) | CameraX + torch |
| Haptic breathe in queue | Web Vibration API or visual pulse | `Vibrator` |
| Shoulder-trigger stretch | Out of scope | Optional later |

## Checklist before you hit submit

- [ ] `npm install && npm run dev` works on your Mac
- [ ] One click **Run Rahul’s BGMI demo** reaches the recap without a phone
- [ ] Recap shows 4 spikes, 6.4 min bad pitch, 94 → 81, tilt-phone tip
- [ ] Disclaimer is visible on Home and Recap
- [ ] You pasted the **repo URL** or attached a **zip** — not an APK
- [ ] Track is **HealthTech**
