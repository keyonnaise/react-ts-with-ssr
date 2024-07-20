import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import functions from "firebase-functions";
import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Transform } from "stream";
import { renderToPipeableStream } from "react-dom/server";
import { useState } from "react";
import { isbot } from "isbot";
const reactLogo = "/assets/react-CHdo91hT.svg";
const viteLogo = "/vite.svg";
function App() {
  const [count, setCount] = useState(0);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("a", { href: "https://vitejs.dev", target: "_blank", children: /* @__PURE__ */ jsx("img", { src: viteLogo, className: "logo", alt: "Vite logo" }) }),
      /* @__PURE__ */ jsx("a", { href: "https://react.dev", target: "_blank", children: /* @__PURE__ */ jsx("img", { src: reactLogo, className: "logo react", alt: "React logo" }) })
    ] }),
    /* @__PURE__ */ jsx("h1", { children: "Vite + React" }),
    /* @__PURE__ */ jsxs("div", { className: "card", children: [
      /* @__PURE__ */ jsxs("button", { onClick: () => setCount((count2) => count2 + 1), children: [
        "count is ",
        count
      ] }),
      /* @__PURE__ */ jsxs("p", { children: [
        "Edit ",
        /* @__PURE__ */ jsx("code", { children: "src/App.tsx" }),
        " and save to test HMR"
      ] })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "read-the-docs", children: "Click on the Vite and React logos to learn more" })
  ] });
}
async function renderer(req, res) {
  let isError = false;
  const stream = renderToPipeableStream(/* @__PURE__ */ jsx(App, {}), {
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
    }
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
    }
  });
  return transform;
}
const app = express();
const corsOptions = {
  origin: true,
  credentials: true
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(compression());
app.get("*", renderer);
const render = functions.https.onRequest(app);
export {
  render
};
