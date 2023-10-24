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

;(async () => {
  try {
		checkForFileExists("LICENSE")
		checkForFileExists("README.md")
  } catch (error) {
    core.setFailed(error.message)
  }
})()
