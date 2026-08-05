import { type TaskContext, task } from "@renderinc/sdk/workflows";

/**
 * Task that squares a number
 */
const square = task({ name: "square" }, function square(_ctx: TaskContext, n: number): number {
  console.log(`Calculating square of ${n} ${_ctx}`);
  return n * n;
});

/**
 * Task that adds the squares of two numbers
 */
task({ name: "add_squares" }, async function add_squares(ctx: TaskContext, a: number, b: number): Promise<number> {
  console.log(`Calculating add_squares of ${a} and ${b}`);
  return await ctx.dispatch(square, a) + await ctx.dispatch(square, b);
});
