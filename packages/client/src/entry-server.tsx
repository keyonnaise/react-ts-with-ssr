import { Transform } from "stream";
import { Request, Response } from "express";
import { renderToPipeableStream } from "react-dom/server";
import App from "./App";
import { isbot } from "isbot";

export async function renderer(req: Request, res: Response) {
  let isError = false;

  const stream = renderToPipeableStream(<App />, {
    bootstrapModules: ["/index.js"],

    onShellReady() {
      if (!isbot(req.get("user-agent"))) {
        res.statusCode = isError ? 500 : 200;

        res.setHeader("content-type", "text/html");
        stream.pipe(transformContent()).pipe(res);
      }
    },

    onShellError() {
      res.statusCode = 500;

      res.setHeader("content-type", "text/html");
      res.send("<h1>Something went wrong</h1>");
    },

    onAllReady() {
      if (isbot(req.get("user-agent"))) {
        res.statusCode = isError ? 500 : 200;

        res.setHeader("content-type", "text/html");
        stream.pipe(transformContent()).pipe(res);
      }
    },

    onError(error) {
      isError = true;

      console.error(error);
    },
  });
}

function transformContent() {
  let content = "";

  const transform = new Transform({
    transform(chunk, _, callback) {
      content += chunk;

      callback();
    },

    flush(callback) {
      const data = `<!doctype html><html lang="en"><head><meta charset="UTF-8" /><link rel="icon" type="image/svg+xml" href="/vite.svg" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Vite + React + TS</title></head><body><div id="root">${content}</div></body></html>`;

      callback(null, data);
    },
  });

  return transform;
}
