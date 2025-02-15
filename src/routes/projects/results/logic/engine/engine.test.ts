import { describe, expect, it } from "vitest";
import { InteractiveEngine } from ".";

describe("InteractiveEngine", () => {
  it("should initialize correctly with valid input", async () => {
    const engine = new InteractiveEngine();
    const input = { hb: 150, age: 30, isMale: true };
    await expect(engine.initialize(input)).resolves.not.toThrow();
    expect(await engine.getFact("hb")).toBe(150);
    expect(await engine.getFact("age")).toBe(30);
    expect(await engine.getFact("isMale")).toBe(true);
  });

  it("should throw an error with invalid input", async () => {
    const engine = new InteractiveEngine();
    const input = { hb: "abc", age: 30, isMale: true }; // Invalid hb value
    await expect(engine.initialize(input)).rejects.toThrow();
  });

  it("should add and retrieve facts correctly", async () => {
    const engine = new InteractiveEngine();
    await engine.initialize({ age: 20, isMale: false, hb: 110 })

    expect(await engine.getFact("age")).toBe(20);
    expect(await engine.getFact("hb")).toBe(110);
  });



  it("Should run", async () => {
    const engine = new InteractiveEngine();
    await engine.initialize({
      age: 20,
      isMale: true,
      hb: 10.4,
      // wbc: 40,
      // plt: 20,
      // mcv: 60,
      creatinine: 0.6
    })

    await engine.run()
  });
});
