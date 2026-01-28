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

// src/create_release.ts
var create_release_exports = {};
__export(create_release_exports, {
  script: () => script
});
module.exports = __toCommonJS(create_release_exports);
async function script(github, ctx) {
  const tag_name = process.env.TAG_NAME;
  if (tag_name === void 0) {
    throw new Error("TAG_NAME must set.");
  }
  const createReleaseParams = {
    owner: ctx.repo.owner,
    repo: ctx.repo.repo,
    tag_name,
    target_commitish: process.env.GITHUB_REF,
    generate_release_notes: true
  };
  console.log("call repos.createRelease:", createReleaseParams);
  await github.rest.repos.createRelease(createReleaseParams);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  script
});
