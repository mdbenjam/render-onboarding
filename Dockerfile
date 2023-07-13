FROM ubuntu

RUN echo "Build $TEST"

ENTRYPOINT echo "Hello $TEST"