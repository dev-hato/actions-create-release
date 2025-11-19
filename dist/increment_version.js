"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/increment_version.ts
var increment_version_exports = {};
__export(increment_version_exports, {
  script: () => script
});
module.exports = __toCommonJS(increment_version_exports);

// node_modules/@octokit/request-error/dist-src/index.js
var RequestError = class extends Error {
  name;
  /**
   * http status code
   */
  status;
  /**
   * Request options that lead to the error.
   */
  request;
  /**
   * Response object if a response was received
   */
  response;
  constructor(message, statusCode, options) {
    super(message, { cause: options.cause });
    this.name = "HttpError";
    this.status = Number.parseInt(statusCode);
    if (Number.isNaN(this.status)) {
      this.status = 0;
    }
    if ("response" in options) {
      this.response = options.response;
    }
    const requestCopy = Object.assign({}, options.request);
    if (options.request.headers.authorization) {
      requestCopy.headers = Object.assign({}, options.request.headers, {
        authorization: options.request.headers.authorization.replace(
          /(?<! ) .*$/,
          " [REDACTED]"
        )
      });
    }
    requestCopy.url = requestCopy.url.replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]").replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
    this.request = requestCopy;
  }
};

// src/increment_version.ts
async function script(github, context) {
  const commit_sha = process.env.SHA;
  if (commit_sha === void 0) {
    throw new Error("SHA must set.");
  }
  let latestReleaseVersion = "";
  try {
    const getLatestReleaseParams = {
      owner: context.repo.owner,
      repo: context.repo.repo
    };
    console.log("call repos.getLatestRelease:", getLatestReleaseParams);
    const latestRelease = await github.rest.repos.getLatestRelease(getLatestReleaseParams);
    latestReleaseVersion = latestRelease.data.tag_name;
  } catch (e) {
    if (e instanceof RequestError && e.status === 404) {
      latestReleaseVersion = "v0.0.0";
    } else {
      throw e;
    }
  }
  const listPullRequestsAssociatedWithCommitParams = {
    owner: context.repo.owner,
    repo: context.repo.repo,
    commit_sha
  };
  console.log(
    "call repos.listPullRequestsAssociatedWithCommit:",
    listPullRequestsAssociatedWithCommitParams
  );
  const pulls = await github.paginate(
    github.rest.repos.listPullRequestsAssociatedWithCommit,
    listPullRequestsAssociatedWithCommitParams
  );
  const labels = pulls.flatMap((p) => p.labels.map((l) => l.name));
  const tagNames = latestReleaseVersion.split(".");
  let version;
  if (labels.includes("major release")) {
    version = [`v${Number(tagNames[0].replace("v", "")) + 1}`, "0", "0"];
  } else if (labels.includes("minor release")) {
    version = [tagNames[0], String(Number(tagNames[1]) + 1), "0"];
  } else {
    version = [tagNames[0], tagNames[1], String(Number(tagNames[2]) + 1)];
  }
  return version.join(".");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  script
});
/*! Bundled license information:

@octokit/request-error/dist-src/index.js:
  (* v8 ignore else -- @preserve -- Bug with vitest coverage where it sees an else branch that doesn't exist *)
*/
