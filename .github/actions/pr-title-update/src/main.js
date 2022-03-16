const core = require("@actions/core");
const github = require("@actions/github");

function updatePR({token, title, pull_number, owner, repo}) {
  const octokit = github.getOctokit(token);
  return octokit.rest.pulls.update({
    owner, repo, pull_number, title,
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
    const title = `${github.context.payload.pull_request.title} ${platform_url}`;
    const pull_number = github.context.payload.pull_request.number;
    const owner = github.context.repo.owner;
    const repo = github.context.repo.repo;

    await updatePR({token, title, pull_number, owner, repo});
  } catch (error) {
    core.error(error);
    core.setFailed(error.message);
  }
}

run();