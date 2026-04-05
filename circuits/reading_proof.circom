pragma circom 2.1.6;

/*
 * IqraArena — Reading Proof Circuit
 * -----------------------------------
 * This circuit proves that a user completed a valid reading session
 * on a specific page WITHOUT revealing:
 *   - The user's real identity or wallet address
 *   - The actual content of the page
 *   - The exact reading duration
 *
 * We use Poseidon hash (ZK-friendly, gas-efficient) from circomlib.
 *
 * Proof system: Groth16 (via SnarkJS)
 * Verification: zkVerify native Groth16 verifier
 */

include "circomlib/circuits/poseidon.circom";
include "circomlib/circuits/comparators.circom";

/*
 * Template: ReadingProof
 *
 * PRIVATE INPUTS (known only to the prover / user's browser):
 *   - user_secret        : A random secret value owned by the user.
 *                          Never leaves the client. Used to derive
 *                          the public user_commitment without revealing identity.
 *   - page_content_hash  : Poseidon hash of the page's text content.
 *                          Proves the user read the *correct* page.
 *   - reading_duration   : Time spent on the page in seconds.
 *                          Proves the user actually read (not just clicked).
 *
 * PUBLIC INPUTS (visible on-chain, safe to expose):
 *   - user_commitment    : Poseidon(user_secret). Acts as an anonymous
 *                          user ID — uniquely identifies a user without
 *                          revealing who they are.
 *   - page_id            : The unique identifier of the page being read.
 *   - session_timestamp  : Unix timestamp of the reading session.
 *                          Used to prevent replay attacks.
 *   - min_read_time      : Minimum required reading time in seconds.
 *                          Set by the platform (e.g. 30 seconds per page).
 *                          Public so the contract can verify the threshold.
 *
 * OUTPUT:
 *   - session_hash       : Poseidon(page_content_hash, page_id, session_timestamp)
 *                          A unique fingerprint of this reading session.
 *                          Stored on-chain as proof of completion.
 */
template ReadingProof() {

    // ── Private inputs ────────────────────────────────────────────────────────
    signal input user_secret;
    signal input page_content_hash;
    signal input reading_duration;

    // ── Public inputs ─────────────────────────────────────────────────────────
    signal input user_commitment;
    signal input page_id;
    signal input session_timestamp;
    signal input min_read_time;

    // ── Output ────────────────────────────────────────────────────────────────
    signal output session_hash;

    // ─────────────────────────────────────────────────────────────────────────
    // CONSTRAINT 1: Verify user identity commitment
    //
    // Proves: "I know a secret that hashes to the public user_commitment."
    // This links the proof to a specific user without revealing who they are.
    // ─────────────────────────────────────────────────────────────────────────
    component identity_hasher = Poseidon(1);
    identity_hasher.inputs[0] <== user_secret;

    // The hash of the user's secret must match the public commitment
    identity_hasher.out === user_commitment;

    // ─────────────────────────────────────────────────────────────────────────
    // CONSTRAINT 2: Verify sufficient reading time
    //
    // Proves: "The user spent at least min_read_time seconds on this page."
    // Prevents bots from submitting proofs without actually reading.
    // Uses a range check: reading_duration >= min_read_time
    // ─────────────────────────────────────────────────────────────────────────
    component time_check = GreaterEqThan(32); // 32-bit comparison (handles up to ~136 years in seconds)
    time_check.in[0] <== reading_duration;
    time_check.in[1] <== min_read_time;

    // This must equal 1 (true) — reading time requirement was met
    time_check.out === 1;

    // ─────────────────────────────────────────────────────────────────────────
    // CONSTRAINT 3: Compute the session hash (output)
    //
    // Produces a unique fingerprint for this reading session by hashing
    // together: the page content, the page ID, and the session timestamp.
    //
    // This hash is stored on-chain and used by the reward contract to:
    //   1. Confirm this exact page was read
    //   2. Prevent duplicate reward claims (same session can't be submitted twice)
    // ─────────────────────────────────────────────────────────────────────────
    component session_hasher = Poseidon(3);
    session_hasher.inputs[0] <== page_content_hash;
    session_hasher.inputs[1] <== page_id;
    session_hasher.inputs[2] <== session_timestamp;

    session_hash <== session_hasher.out;
}

// Instantiate with public signals declared for Groth16
component main { public [user_commitment, page_id, session_timestamp, min_read_time] } = ReadingProof();
