# **IqraArena**

**IqraArena** is a next-generation digital reading ecosystem designed to transform how readers interact with books, authors, and communities.  
The platform combines intelligent reading tools, secure digital ownership, and a dynamic reward system to create a more engaging, transparent, and equitable reading experience.

Users can read books, track progress, participate in discussions, earn points, and redeem rewards — all through a seamless and intuitive application.  
Authors and publishers gain access to a modern distribution model with full control over their content and revenue, while readers enjoy a deeply interactive and motivating journey through literature.

Live app: https://iqraarena.xyz/

---

## **Misson**

**Our mission** is to transform reading into a rewarding, empowering, and truly interactive experience.  
We aim to build a global ecosystem where readers are motivated to learn, grow, and stay engaged, while authors receive fair, transparent, and modern tools to distribute and monetize their work.

By combining intelligent reading technology, gamified engagement, and verifiable digital ownership, we are creating a platform that values knowledge, encourages curiosity, and strengthens the connection between creators and their audiences.

---

## **Problem**

Millions of readers around the world spend countless hours consuming books, yet existing reading platforms offer no meaningful recognition, incentives, or sense of progress.  
Engagement is largely passive, leading many users to abandon reading habits despite strong initial interest.

At the same time, authors and publishers face major challenges:

- **Limited control over digital distribution**
- **Slow and inefficient payout systems**
- **Difficulty building active and loyal reader communities**
- **Minimal protection for digital ownership and rights**

The industry lacks a system that rewards readers for their effort and fairly empowers authors with modern, transparent distribution tools.

---

## **Solution**

**IqraArena** introduces a comprehensive ecosystem that reshapes the reading experience for both readers and creators.

---

### **Smart Reading Platform with Embedded Wallet**

Every user receives an embedded, secure, non-custodial wallet at signup — automatically and without technical complexity.  
This wallet manages all in-app interactions such as purchasing books, holding digital assets, redeeming rewards, and verifying achievements.

The process is fully integrated, user-friendly, and requires no prior technical knowledge.

---

### **Digital Book Marketplace with Verifiable Ownership**

Authors and publishers can publish their books with verifiable digital ownership.  
This empowers creators with:

- **Full control over pricing and distribution**
- **Instant and fair revenue settlement**
- **Global accessibility**

Readers benefit from true ownership of their digital books and a transparent system that protects creator rights.

---

### **Gamified Reading & Community Layer**

Users earn **“Read Points”** by:

- Progressing through books  
- Writing reviews  
- Participating in community discussions  
- Joining challenges and leaderboards  

This transforms reading into an engaging, interactive journey and builds a healthy community around shared knowledge.

---

### **Real Rewards for Engagement**

User engagement translates directly into real-world value.  
Readers can convert their **“Read Points”** into:

- Digital items  
- Exclusive books  
- Access to premium features  
- Physical products from partners  

Every redemption is verifiable and designed to build trust, transparency, and long-term motivation.

---

## How ZPK works

```
User reads page (30s+)
        │
        ▼
Browser generates Groth16 proof (Circom + SnarkJS)
  Private: user_secret, page_content_hash, reading_duration
  Public:  user_commitment, page_id, session_timestamp
        │
        ▼
zkverify.js submits proof to zkVerify chain
        │
        ▼
zkVerify native Groth16 verifier validates proof (~1 second, ~90% cheaper than Ethereum)
        │
        ▼
Attestation posted to Base
        │
        ▼
IqraArena reward contract unlocks reading rewards
```

---

## Circuit: `reading_proof.circom`

### Private inputs (never leave the user's browser)

| Signal | Description |
|---|---|
| `user_secret` | Random secret owned by the user. Used to derive their anonymous on-chain identity. |
| `page_content_hash` | Poseidon hash of the page text. Binds the proof to a specific page. |
| `reading_duration` | Seconds spent on the page. Proves actual reading happened. |

### Public inputs (safe to expose on-chain)

| Signal | Description |
|---|---|
| `user_commitment` | `Poseidon(user_secret)` — anonymous user identifier |
| `page_id` | Unique identifier of the page that was read |
| `session_timestamp` | Unix timestamp of the session — prevents replay attacks |
| `min_read_time` | Minimum required reading time (e.g. 30 seconds) |

### Output

| Signal | Description |
|---|---|
| `session_hash` | `Poseidon(page_content_hash, page_id, session_timestamp)` — unique session fingerprint stored on-chain |

### Constraints enforced

1. `Poseidon(user_secret) == user_commitment` — proves the user owns the secret behind their commitment
2. `reading_duration >= min_read_time` — proves sufficient reading time (bot prevention)
3. `Poseidon(page_content_hash, page_id, session_timestamp) == session_hash` — proves the correct page was read

---

## ZK Technology Stack

| Component | Technology | Why |
|---|---|---|
| Circuit language | Circom 2.1.6 | Mature, widely audited, supported by zkVerify |
| Proof system | Groth16 | Smallest proof size (~200 bytes), lowest verification cost |
| Hash function | Poseidon | ZK-friendly, 50x cheaper in-circuit than SHA256 |
| Verification | zkVerify native Groth16 verifier | 90%+ cost reduction vs Ethereum |
| Submission | zkverify.js | Official zkVerify JavaScript SDK |

---

## Setup & Usage

### Prerequisites

- Node.js >= 18
- Circom 2.1.6 — [install guide](https://docs.circom.io/getting-started/installation/)

### Install dependencies

```bash
npm install
```

### Compile the circuit

```bash
npm run compile
```

This generates `build/reading_proof.r1cs`, `build/reading_proof.wasm`, and `build/reading_proof.sym`.

### Trusted setup (Powers of Tau)

```bash
# Download the phase 1 ceremony output (12th power — supports up to 4096 constraints)
wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_12.ptau -O pot12_final.ptau

# Phase 2 setup for this specific circuit
npm run setup

# Add your entropy contribution
npm run contribute

# Export the verification key
npm run export-vk
```

### Run tests

```bash
npm test
```

Tests cover:
- Valid reading sessions (standard, boundary cases, long sessions)
- Identity constraint violations (wrong secret, tampered commitment)
- Time constraint violations (below minimum, zero duration bot attack)


## License

MIT
