FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim

WORKDIR /app

# git and ssh are needed to fetch the SDK from its private repo.
RUN apt-get update \
    && apt-get install -y --no-install-recommends git openssh-client \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p -m 0700 /root/.ssh \
    && ssh-keyscan github.com >> /root/.ssh/known_hosts

# Install dependencies in their own layer so they stay cached across changes to
# the task source. Needs an SSH agent, e.g. `docker build --ssh default .`
COPY pyproject.toml uv.lock ./
RUN --mount=type=ssh uv sync --locked --no-dev

COPY task.py .

CMD ["uv", "run", "--no-sync", "task.py"]
