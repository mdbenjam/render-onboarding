"""Example usage of the Render Tasks Python SDK."""

import asyncio
import logging
import sys
import time
from render_sdk import Workflows

from render_sdk.workflows import Retry

# Configure logging
logging.basicConfig(level=logging.WARNING)
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

app = Workflows()


@app.task
def square(a: int) -> int:
    """Square a number."""
    logger.info(f"Computing square of {a}")
    return a * a


@app.task
async def add_squares(a: int, b: int) -> int:
    """Add the squares of two numbers."""
    logger.info(f"Computing add_squares: {a}, {b}")

    # Execute subtasks
    result1 = await square(a)
    logger.info(f"Square result: {result1}")
    result2 = await square(b)
    logger.info(f"Square result: {result2}")

    return result1 + result2

@app.task
async def exit_early() -> int:
    sys.exit(0)


@app.task(
    name="custom_add",
    retry=Retry(max_retries=3, wait_duration_ms=1000),
)
def add_numbers(a: int, b: int) -> int:
    """Add two numbers with retry configuration."""
    logger.info(f"Adding {a} + {b}")
    return a + b

@app.task
def log(a: str):
    print(a)


@app.task
def greet(name: str) -> str:
    """Greet someone."""
    logger.info(f"Greeting {name}")
    return f"Hello 7, {name}!"


@app.task
async def fan_out(n: int) -> list[int]:
    """Fan out a number into a list of numbers."""
    squares = [square(i) for i in range(n)]
    results = await asyncio.gather(*squares)
    return results

@app.task
async def sleep(seconds: int) -> None:
    """Sleep for a number of seconds."""
    logger.info(f"Sleeping for {seconds} seconds")
    await asyncio.sleep(seconds)
    return seconds

@app.task
async def test_fail_parent_task() -> None:
    """start subtasks then fail"""
    await square(4)

    sleep(10)
    sleep(20)

    await asyncio.sleep(5)

    raise Exception("Test failure")

@app.task(plan="pro_ultra")
async def big_square(a: int) -> int:
    return a * a

@app.task
async def big_task_fan_out(n: int) -> None:
    squares = [big_square(i) for i in range(n)]
    results = await asyncio.gather(*squares)
    return results

if __name__ == "__main__":
    try:
        app.start()
    except Exception as e:
        logger.error(f"Error starting Render Tasks example: {e}")
        raise
