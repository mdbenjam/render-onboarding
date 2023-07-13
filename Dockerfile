FROM ubuntu
ARG TEST
RUN echo $TEST

ENTRYPOINT echo "Hello $TEST"