module.exports = async ({ github, context }) => {
  const createReleaseParams = {
    owner: context.repo.owner,
    repo: context.repo.repo,
    tag_name: process.env.TAG_NAME,
    target_commitish: process.env.GITHUB_REF,
    generate_release_notes: true
  }
  console.log('call repos.createRelease:', createReleaseParams)
  await github.rest.repos.createRelease(createReleaseParams)
}
