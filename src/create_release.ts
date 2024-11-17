import type { Context } from "@actions/github/lib/context";
import type { GitHub } from "@actions/github/lib/utils";
import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

export async function script(
  github: InstanceType<typeof GitHub>,
  context: Context,
) {
  const tag_name = process.env.TAG_NAME;

  if (tag_name === undefined) {
    throw new Error("TAG_NAME must set.");
  }

  const createReleaseParams: RestEndpointMethodTypes["repos"]["createRelease"]["parameters"] =
    {
      owner: context.repo.owner,
      repo: context.repo.repo,
      tag_name,
      target_commitish: process.env.GITHUB_REF,
      generate_release_notes: true,
    };
  console.log("call repos.createRelease:", createReleaseParams);
  await github.rest.repos.createRelease(createReleaseParams);
}
