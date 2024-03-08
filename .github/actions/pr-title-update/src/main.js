const core = require("@actions/core");
const github = require("@actions/github");

function updatePR({token, body, pull_number, owner, repo}) {
  const octokit = github.getOctokit(token);
  return octokit.rest.pulls.update({
    owner, repo, pull_number, body,
  });
}

async function run() {
  try {
    const token = process.env["GITHUB_TOKEN"];
    if (!token) {
      core.setFailed("Requires: GITHUB_TOKEN");
      return;
    }

    if (github.context.eventName !== "pull_request") {
      core.info(
        `Skipping PR: this isn't a pull_request event for us to handle`
      );
      return;
    }

    if (github.context.payload.action !== "opened") {
      core.info(
        `Skipping PR: this PR was already updated with a base branch label`
      );
      return;
    }

    const platform_url = core.getInput("platform_url", { required: true });
    let body = github.context.payload.pull_request.body

    // Prepend platform URL to PR body
    body =
`${platform_url}

${body ? body : ""}`;

    const pull_number = github.context.payload.pull_request.number;
    const owner = github.context.repo.owner;
    const repo = github.context.repo.repo;

    await updatePR({token, body, pull_number, owner, repo});
  } catch (error) {
    core.error(error);
    core.setFailed(error.message);
  }
}

run();
