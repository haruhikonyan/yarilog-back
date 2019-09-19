FROM node:12.10.0
ENV LANG C.UTF-8

WORKDIR /yarilog-back
COPY . /yarilog-back
RUN echo "PWD: $PWD" && \
  echo "ls: $(ls -la)" && \
  echo "PATH: $(echo $PATH)" && \
  echo "node version: $(node -v)" && \
  echo "npm version: $(npm -v)"

ENV PATH="/yarilog-back/node_modules/.bin:${PATH}"
CMD /bin/sh -c 'set -x echo $PATH && ls -1a && ls ./node_modules -la && ls ./node_modules/.bin/ -la'
