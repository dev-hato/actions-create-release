import type { context } from "@actions/github";
import type { GitHub } from "@actions/github/lib/utils";
import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

export async function script(
  github: InstanceType<typeof GitHub>,
  ctx: typeof context,
) {
  const tag_name = process.env.TAG_NAME;

  if (tag_name === undefined) {
    throw new Error("TAG_NAME must set.");
  }

  const createReleaseParams: RestEndpointMethodTypes["repos"]["createRelease"]["parameters"] =
    {
      owner: ctx.repo.owner,
      repo: ctx.repo.repo,
      tag_name,
      target_commitish: process.env.GITHUB_REF,
      generate_release_notes: true,
    };
  console.log("call repos.createRelease:", createReleaseParams);
  await github.rest.repos.createRelease(createReleaseParams);
}
