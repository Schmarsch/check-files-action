const core = require("@actions/core")
const github = require("@actions/github")
const fs = require("fs")

async function checkForFileExists(filePath) {
  return fs.promises
    .access(filePath)
    .then(() => {
      core.info(`File ${filePath} exists`)
      return true
    })
    .catch(() => {
      core.setFailed(`File ${filePath} does not exist but is mandatory`)
      return false
    })
}

// create a function that check if the file starts with a markdown header
async function checkForMarkdownHeader(filePath) {
  return fs.promises
    .readFile(filePath, "utf8")
    .then((data) => {
      // remove all the empty at the beginning of the file using a regex
      data = data.replace(/^\s*\n/gm, "")
      if (data.startsWith("# ")) {
        core.info(`File ${filePath} starts with a markdown header`)
        return true
      } else {
        core.setFailed(`File ${filePath} does not start with a markdown header`)
        return false
      }
    })
    .catch(() => {
      core.setFailed(`File ${filePath} does not exist but is mandatory`)
      return false
    })
}

;(async () => {
  try {
    checkForFileExists("LICENSE")
    checkForFileExists("README.md")

    if (!(await checkForMarkdownHeader("README.md"))) {
      // get token for octokit
      const token = core.getInput("repo-token")
      const octokit = github.getOctokit(token)

	core.notice("Creating a check for README.md")

      // call octokit to create a check with annotations and details
      const check = await octokit.rest.checks.create({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        name: "Readme Validator",
        head_sha: github.context.sha,
        status: "completed",
        conclusion: "failure",
        output: {
          title: "README.md must start with a title",
          summary:
            "Please use markdown syntax to add a title ad the beginning of your README.md file",
          annotations: [
            {
              path: "README.md",
              start_line: 1,
              end_line: 1,
              annotation_level: "failure",
              message: "README.md must start with a header",
              start_column: 1,
              end_column: 1,
            },
          ],
        },
      })
    }
  } catch (error) {
    core.setFailed(error.message)
  }
})()
