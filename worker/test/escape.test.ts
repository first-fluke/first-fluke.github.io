/**
 * Fixture tests for escapeBackticks (D8 sanitisation, audit §2 LOW remediation).
 * Verifies that user input cannot break out of the ```text fence wrapping the issue body.
 */
import { describe, it, expect } from "vitest";
import { escapeBackticks } from "../src/index";

const ZWSP = "\u200B";

describe("escapeBackticks — D8 fence-escape fixtures", () => {
  it("passes through input without backticks unchanged", () => {
    const input = "Hello, this is a normal message.";
    expect(escapeBackticks(input)).toBe(input);
  });

  it("passes through 1-2 backticks unchanged (inline code is fine)", () => {
    expect(escapeBackticks("` x")).toBe("` x");
    expect(escapeBackticks("`` x")).toBe("`` x");
  });

  it("escapes a 3-backtick run with ZWSP between each", () => {
    const out = escapeBackticks("```");
    expect(out).toBe(`\`${ZWSP}\`${ZWSP}\``);
    expect(out).not.toContain("```");
  });

  it("escapes a longer backtick run (≥4)", () => {
    const out = escapeBackticks("`````");
    expect(out).not.toContain("```");
    expect(out.split(ZWSP).join("")).toBe("`````"); // round-trip removes ZWSP
  });

  it("escapes multiple separate backtick runs in one message", () => {
    const out = escapeBackticks("before ``` middle ```` after");
    expect(out).not.toContain("```");
    expect(out).toContain("before ");
    expect(out).toContain(" middle ");
    expect(out).toContain(" after");
  });

  it("does NOT escape HTML (it relies on code-fence wrap, not HTML sanitisation)", () => {
    // The fence wrap is the actual defense; this test documents that escapeBackticks
    // is NOT responsible for HTML escaping.
    const html = '<script>alert(1)</script><img src="x" />';
    expect(escapeBackticks(html)).toBe(html);
  });

  it("preserves Korean text and zero-width chars unchanged when no backtick run", () => {
    const zalgo = "안녕하세요\u200B\u200C\u200D";
    expect(escapeBackticks(zalgo)).toBe(zalgo);
  });

  it("blocks the canonical fence-escape attack vector", () => {
    // Attacker tries: close the ```text fence, inject markdown, reopen
    const attack = "harmless\n```\n[click](https://evil.example)\n```text\nmore";
    const out = escapeBackticks(attack);
    // No raw triple-backtick remains, so the wrapping ```text fence stays intact
    expect(out).not.toMatch(/^```$/m);
    expect(out).not.toMatch(/```text/);
  });
});
