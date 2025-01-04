import type { GitHub } from "@actions/github/lib/utils";
import type { Context } from "@actions/github/lib/context";
import type { PaginatingEndpoints } from "@octokit/plugin-paginate-rest";
import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
import { RequestError } from "@octokit/request-error";

export async function script(
  github: InstanceType<typeof GitHub>,
  context: Context,
): Promise<string> {
  const commit_sha = process.env.SHA;

  if (commit_sha === undefined) {
    throw new Error("SHA must set.");
  }

  let latestReleaseVersion = "";

  try {
    const getLatestReleaseParams: RestEndpointMethodTypes["repos"]["getLatestRelease"]["parameters"] =
      {
        owner: context.repo.owner,
        repo: context.repo.repo,
      };
    console.log("call repos.getLatestRelease:", getLatestReleaseParams);
    const latestRelease: RestEndpointMethodTypes["repos"]["getLatestRelease"]["response"] =
      await github.rest.repos.getLatestRelease(getLatestReleaseParams);
    latestReleaseVersion = latestRelease.data.tag_name;
  } catch (e) {
    if (e instanceof RequestError && e.status === 404) {
      latestReleaseVersion = "v0.0.0";
    } else {
      throw e;
    }
  }

  const listPullRequestsAssociatedWithCommitParams: RestEndpointMethodTypes["repos"]["listPullRequestsAssociatedWithCommit"]["parameters"] =
    {
      owner: context.repo.owner,
      repo: context.repo.repo,
      commit_sha,
    };
  console.log(
    "call repos.listPullRequestsAssociatedWithCommit:",
    listPullRequestsAssociatedWithCommitParams,
  );
  const pulls: PaginatingEndpoints["GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls"]["response"]["data"] =
    await github.paginate(
      github.rest.repos.listPullRequestsAssociatedWithCommit,
      listPullRequestsAssociatedWithCommitParams,
    );
  const labels = pulls.flatMap((p) => p.labels.map((l) => l.name));
  const tagNames = latestReleaseVersion.split(".");
  let version: string[];

  if (labels.includes("major release")) {
    version = [`v${Number(tagNames[0].replace("v", "")) + 1}`, "0", "0"];
  } else if (labels.includes("minor release")) {
    version = [tagNames[0], String(Number(tagNames[1]) + 1), "0"];
  } else {
    version = [tagNames[0], tagNames[1], String(Number(tagNames[2]) + 1)];
  }

  return version.join(".");
}
