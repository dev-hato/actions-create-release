module.exports = async ({github, context}) => {
    let latestReleaseVersion = '';

    try {
        const getLatestReleaseParams = {
            owner: context.repo.owner,
            repo: context.repo.repo
        };
        console.log("call repos.getLatestRelease:", getLatestReleaseParams);
        const latestRelease = await github.rest.repos.getLatestRelease(getLatestReleaseParams);
        latestReleaseVersion = latestRelease.data.tag_name;
    } catch (e) {
        if (e.status === 404) {
            latestReleaseVersion = 'v0.0.0';
        } else {
            throw e;
        }
    }

    const listPullRequestsAssociatedWithCommitParams = {
        owner: context.repo.owner,
        repo: context.repo.repo,
        commit_sha: process.env.SHA,
    };
    console.log("call repos.listPullRequestsAssociatedWithCommit:", listPullRequestsAssociatedWithCommitParams);
    const pulls = await github.paginate(
        github.rest.repos.listPullRequestsAssociatedWithCommit,
        listPullRequestsAssociatedWithCommitParams
    );
    const labels = pulls.flatMap(p => p.labels.map(l => l.name));
    const tagNames = latestReleaseVersion.split('.');
    let version;

    if (labels.includes('major release')) {
        version = [`v${Number(tagNames[0].replace('v', '')) + 1}`, 0, 0];
    } else if (labels.includes('minor release')) {
        version = [tagNames[0], Number(tagNames[1]) + 1, 0];
    } else {
        version = [tagNames[0], tagNames[1], Number(tagNames[2]) + 1];
    }

    return version.join('.');
}
