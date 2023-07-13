FROM ubuntu

RUN echo $TEST

ENTRYPOINT echo "Hello $TEST"