FROM hayd/alpine-deno:1.1.1

ENV APP_DIR /app/

WORKDIR $APP_DIR

USER deno

ADD . $APP_DIR

RUN deno cache --unstable -c tsconfig.json server.ts

CMD ["run", "--unstable", "--allow-net", "--allow-env", "--allow-read", "--allow-write", "-c", "tsconfig.json", "server.ts"]
