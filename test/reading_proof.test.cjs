/**
 * IqraArena — Reading Proof Circuit Tests
 * -----------------------------------------
 * Tests for the reading_proof.circom circuit.
 *
 * We test three categories:
 *   1. Valid proofs — should pass all constraints
 *   2. Identity violations — wrong user secret should fail
 *   3. Time violations — insufficient reading time should fail
 *
 * Run with:
 *   npm test
 *   (requires circuit to be compiled first: npm run compile)
 */

const { buildPoseidon } = require("circomlibjs");
const { wasm: wasmTester } = require("circom_tester");
const path = require("path");
const assert = require("assert");

// Path to the circuit file under test
const CIRCUIT_PATH = path.join(__dirname, "../circuits/reading_proof.circom");

// ── Test helpers ──────────────────────────────────────────────────────────────

/**
 * Builds a valid set of circuit inputs for testing.
 * All constraints should pass with these values.
 */
async function buildValidInputs(overrides = {}) {
    const poseidon = await buildPoseidon();
    const F = poseidon.F;

    const userSecret      = BigInt("12345678901234567890");
    const pageId          = BigInt(42);
    const sessionTimestamp = BigInt(1700000000);
    const readingDuration  = BigInt(60); // 60 seconds — above the 30s minimum
    const minReadTime      = BigInt(30);

    // Derive user commitment: Poseidon(user_secret)
    const userCommitment = F.toObject(poseidon([userSecret]));

    // Derive page content hash: Poseidon(content, page_id)
    const pageContentRaw  = BigInt("999888777666555444");
    const pageContentHash = F.toObject(poseidon([pageContentRaw, pageId]));

    // Session hash (output): Poseidon(page_content_hash, page_id, timestamp)
    const expectedSessionHash = F.toObject(poseidon([pageContentHash, pageId, sessionTimestamp]));

    return {
        inputs: {
            user_secret:       userSecret.toString(),
            page_content_hash: pageContentHash.toString(),
            reading_duration:  readingDuration.toString(),
            user_commitment:   userCommitment.toString(),
            page_id:           pageId.toString(),
            session_timestamp: sessionTimestamp.toString(),
            min_read_time:     minReadTime.toString(),
            ...overrides,
        },
        expectedSessionHash,
    };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("ReadingProof Circuit", function () {
    // Circuit compilation can take a few seconds
    this.timeout(60000);

    let circuit;

    before(async () => {
        // Compile the circuit once before all tests
        circuit = await wasmTester(CIRCUIT_PATH, {
            include: path.join(__dirname, "../node_modules"),
        });
    });

    // ── CATEGORY 1: Valid proofs ───────────────────────────────────────────────

    describe("Valid reading sessions", () => {
        it("should generate a valid proof for a standard reading session", async () => {
            const { inputs, expectedSessionHash } = await buildValidInputs();
            const witness = await circuit.calculateWitness(inputs, true);
            await circuit.checkConstraints(witness);

            // Verify that session_hash output matches our expected value
            // Output signal is at index 1 in the witness array
            assert.equal(
                witness[1].toString(),
                expectedSessionHash.toString(),
                "session_hash output does not match expected value"
            );
        });

        it("should accept reading duration exactly equal to minimum (boundary case)", async () => {
            // Edge case: duration == min_read_time should still pass
            const { inputs } = await buildValidInputs({ reading_duration: "30" });
            const witness = await circuit.calculateWitness(inputs, true);
            await circuit.checkConstraints(witness);
        });

        it("should accept a long reading session (200 seconds)", async () => {
            const { inputs } = await buildValidInputs({ reading_duration: "200" });
            const witness = await circuit.calculateWitness(inputs, true);
            await circuit.checkConstraints(witness);
        });

        it("should produce different session hashes for different pages", async () => {
            const { inputs: inputs1, expectedSessionHash: hash1 } = await buildValidInputs({ page_id: "1" });
            const { inputs: inputs2, expectedSessionHash: hash2 } = await buildValidInputs({ page_id: "2" });

            assert.notEqual(
                hash1.toString(),
                hash2.toString(),
                "Different pages must produce different session hashes"
            );

            // Both should be valid witnesses
            const witness1 = await circuit.calculateWitness(inputs1, true);
            await circuit.checkConstraints(witness1);
        });
    });

    // ── CATEGORY 2: Identity violations ───────────────────────────────────────

    describe("Identity constraint violations", () => {
        it("should REJECT a proof with a wrong user secret", async () => {
            const { inputs } = await buildValidInputs({
                // user_secret is wrong — will not hash to user_commitment
                user_secret: "99999999999999999999",
            });

            let threw = false;
            try {
                await circuit.calculateWitness(inputs, true);
            } catch (e) {
                threw = true;
                assert.match(
                    e.message,
                    /Error|Assert|constraint/i,
                    "Expected a constraint failure for wrong user secret"
                );
            }
            assert.equal(threw, true, "Circuit should have thrown for wrong user secret");
        });

        it("should REJECT a proof where user_commitment is tampered with", async () => {
            const { inputs } = await buildValidInputs({
                // Someone tries to claim a different user's commitment
                user_commitment: "111222333444555666777",
            });

            let threw = false;
            try {
                await circuit.calculateWitness(inputs, true);
            } catch (e) {
                threw = true;
            }
            assert.equal(threw, true, "Circuit should reject tampered user_commitment");
        });
    });

    // ── CATEGORY 3: Time constraint violations ─────────────────────────────────

    describe("Reading time constraint violations", () => {
        it("should REJECT a proof with reading duration below minimum (29 seconds)", async () => {
            const { inputs } = await buildValidInputs({
                reading_duration: "29", // below the 30s minimum
            });

            let threw = false;
            try {
                await circuit.calculateWitness(inputs, true);
            } catch (e) {
                threw = true;
                assert.match(
                    e.message,
                    /Error|Assert|constraint/i,
                    "Expected a constraint failure for insufficient reading time"
                );
            }
            assert.equal(threw, true, "Circuit should reject reading duration below minimum");
        });

        it("should REJECT a proof with zero reading duration (bot attack simulation)", async () => {
            const { inputs } = await buildValidInputs({ reading_duration: "0" });

            let threw = false;
            try {
                await circuit.calculateWitness(inputs, true);
            } catch (e) {
                threw = true;
            }
            assert.equal(threw, true, "Circuit should reject zero reading duration");
        });
    });
});
