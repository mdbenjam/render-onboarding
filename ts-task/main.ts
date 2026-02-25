import { task } from "@renderinc/sdk/workflows";

/**
 * Task that squares a number
 */
const square = task({ name: "square" }, function square(n: number): number {
  console.log(`Calculating square of ${n}`);
  return n * n;
});

/**
 * Task that adds the squares of two numbers
 */
task({ name: "add_squares" }, async function add_squares(a: number, b: number): Promise<number> {
  console.log(`Calculating add_squares of ${a} and ${b}`);
  return await square(a) + await square(b);
});
