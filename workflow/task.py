"""Example usage of the Render Tasks Python SDK."""

import asyncio
import logging
import sys

from render_sdk import Workflows
from render_sdk.workflows import Retry, TaskContext

# Configure logging
logging.basicConfig(level=logging.WARNING)
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

app = Workflows()


@app.task
def square(ctx: TaskContext, a: int) -> int:
    """Square a number."""
    logger.info(f"Computing square of {a}")
    return a * a


@app.task
async def add_squares(ctx: TaskContext, a: int, b: int) -> int:
    """Add the squares of two numbers."""
    logger.info(f"Computing add_squares: {a}, {b}")

    # Execute subtasks
    result1 = await ctx.dispatch(square, a)
    logger.info(f"Square result: {result1}")
    result2 = await ctx.dispatch(square, b)
    logger.info(f"Square result: {result2}")

    return result1 + result2

@app.task
async def exit_early(ctx: TaskContext) -> int:
    sys.exit(0)


@app.task(
    name="custom_add",
    retry=Retry(max_retries=3, wait_duration_ms=1000),
)
def add_numbers(ctx: TaskContext, a: int, b: int) -> int:
    """Add two numbers with retry configuration."""
    logger.info(f"Adding {a} + {b}")
    return a + b

@app.task
def log(ctx: TaskContext, a: str):
    print(a)


@app.task
def greet(ctx: TaskContext, name: str) -> str:
    """Greet someone."""
    logger.info(f"Greeting {name}")
    return f"Hello 7, {name}!"


@app.task
async def fan_out(ctx: TaskContext, n: int) -> list[int]:
    """Fan out a number into a list of numbers."""
    squares = [ctx.dispatch(square, i) for i in range(n)]
    results = await asyncio.gather(*squares)
    return results

@app.task
async def sleep(ctx: TaskContext, seconds: int) -> None:
    """Sleep for a number of seconds."""
    logger.info(f"Sleeping for {seconds} seconds")
    await asyncio.sleep(seconds)
    return seconds

@app.task
async def test_fail_parent_task(ctx: TaskContext) -> None:
    """start subtasks then fail"""
    await ctx.dispatch(square, 4)

    # Start the sleeps without waiting on them, so the failure below happens
    # while they are still running.
    asyncio.create_task(ctx.dispatch(sleep, 10))
    asyncio.create_task(ctx.dispatch(sleep, 20))

    await asyncio.sleep(5)

    raise Exception("Test failure")

@app.task(plan="pro_ultra")
async def big_square(ctx: TaskContext, a: int) -> int:
    return a * a

@app.task
async def big_task_fan_out(ctx: TaskContext, n: int) -> None:
    squares = [ctx.dispatch(big_square, i) for i in range(n)]
    results = await asyncio.gather(*squares)
    return results

if __name__ == "__main__":
    try:
        app.start()
    except Exception as e:
        logger.error(f"Error starting Render Tasks example: {e}")
        raise
