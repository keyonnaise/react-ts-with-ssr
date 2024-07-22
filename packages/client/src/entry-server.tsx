import { Transform } from "stream";
import { Request, Response } from "express";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App";
import { isbot } from "isbot";
import { HelmetProvider } from "react-helmet-async";

export async function renderer(req: Request, res: Response) {
  const helmetContext: Record<string, any> = {};

  let isError = false;

  const stream = renderToPipeableStream(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={req.url}>
        <App />
      </StaticRouter>
    </HelmetProvider>,
    {
      bootstrapModules: ["/index.js"],

      onShellReady() {
        if (!isbot(req.get("user-agent"))) {
          res.statusCode = isError ? 500 : 200;

          res.setHeader("content-type", "text/html");
          stream.pipe(transformContent(helmetContext)).pipe(res);
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
          stream.pipe(transformContent(helmetContext)).pipe(res);
        }
      },

      onError(error) {
        isError = true;

        console.error(error);
      },
    }
  );
}

function transformContent(helmetContext: Record<string, any>) {
  let content = "";

  const transform = new Transform({
    transform(chunk, _, callback) {
      content += chunk;

      callback();
    },

    flush(callback) {
      const helmet = helmetContext.helmet;
      const data = `<!DOCTYPE html><html ${helmet.htmlAttributes.toString()}><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}${helmet.priority.toString()}${helmet.script.toString()}</head><body><div id="root">${content}</div></body></html>`;

      callback(null, data);
    },
  });

  return transform;
}
