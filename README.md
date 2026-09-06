# MatchLoad

*Measuring in-match gaming load — so peak performance lasts longer than one clutch round.*

Session-time wellness and ergonomics companion for mobile gamers. Built as an uploadable **iQOO HealthTech** hackathon prototype.

MatchLoad scores *this session’s* grip / tremor load, flexed-neck minutes, and between-round recovery — then coaches a reset in matchmaking. It is **not** a next-morning report and **not** a medical device.

> Formerly prototyped under the name Clutch Index. Same product, same Rahul demo.

## Run locally (Mac)

```bash
```bash
npm run build    # static files in dist/
npm run preview  # serve the production build
```
No accounts. No backend. No Android SDK. No cloud vitals.
## What judges should click

1. **Run Rahul’s BGMI demo** — a scripted ~68s replay. No sensors required.
2. Watch the overlay through a firefight (4 clutch spikes), a quiet mid-round, a queue breathe cue, and a 15s finger-on-lens PPG simulation.
3. Land on the recap: **4 spikes · 6.4 min bad pitch · HR 94 → 81 (Δ −13) · tilt the phone up**.

Optional: **Start live-ish session** uses `DeviceMotion` / `DeviceOrientation` when the browser allows it (iPhone Safari will prompt). On a Mac without motion, scores stay near baseline and you can still walk Between rounds → PPG → Recap. If sensors are blocked, use the Rahul demo — that is the judged story.

## Demo vs live

| Mode | How scores move | Sensors |
| --- | --- | --- |
| **Demo / Replay** | `src/demo/script.ts` drives a Rahul timeline (drop → loot → firefight spikes → quiet overlay → queue haptic → 15s PPG → recap). | None. Web Vibration API pulses on inhale/spike if the browser supports it; otherwise the breathe orb is the cue. |
| **Live-ish** | Pitch (device beta) accumulates flexed-neck time. Motion-magnitude variance is a light tremor / death-grip proxy. PPG remains a 15s simulated capture (optional rear-camera preview). | Optional. Clean fallback if permission is denied or the laptop has no IMU. |

Scoring is a 0–100 **Clutch Index** plus three subscores: Tremor/Grip, Posture-time, Recovery HR. Higher means more session load, not a diagnosis.

## Wellness disclaimer

Clutch Index does **not** diagnose conditions and does **not** claim blood pressure, ECG, medical SpO2, or disease detection. Demo numbers are scripted. Live-ish numbers are coaching proxies from device motion and a simulated fingertip capture.
| **Demo / Replay** | `src/demo/script.ts` drives a Rahul timeline (drop → loot → firefight spikes → quiet overlay → queue haptic → 15s PPG → recap). | None. Web Vibration API pulses on inhale/spike if the browser supports it; otherwise the breathe orb is the cue. |
| **Live-ish** | Pitch (device beta) accumulates flexed-neck time. Motion-magnitude variance is a light tremor / death-grip proxy. PPG remains a 15s simulated capture (optional rear-camera preview). | Optional. Clean fallback if permission is denied or the laptop has no IMU. |

Scoring is a 0–100 **MatchLoad** plus three subscores: Tremor/Grip, Posture-time, Recovery HR. Higher means more session load, not a diagnosis.

## Wellness disclaimer

MatchLoad does **not** diagnose conditions and does **not** claim blood pressure, ECG, medical SpO2, or disease detection. Demo numbers are scripted. Live-ish numbers are coaching proxies from device motion and a simulated fingertip capture.

The same disclaimer is on Home, Between-rounds, and Recap.

## Future Android / Kotlin port (not required to run this upload)

This web prototype is the deliverable they can open tonight. A later native port would map the same product onto:

- `SensorManager` — gyro / accel at high rate for micro-tremor and landscape-lock time
- `Sensor.TYPE_ROTATION_VECTOR` / game rotation — pitch → flexed-neck minutes
- CameraX + torch — 15s rear-camera PPG between rounds
- `Vibrator` / `VibrationEffect` — paced-breathe cue in matchmaking
- Optional shoulder-trigger mash as a stretch prompt (out of scope here)

Do not require the Android SDK, an APK, or an Android phone to evaluate this repo.

## Submission

See [SUBMISSION.md](./SUBMISSION.md) for the one-paragraph pitch, track, 90-second script, and exactly what to paste into the Reskilll form (repo URL or zip).
