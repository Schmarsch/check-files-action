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
			if (data.startsWith("# ")) {

				// remove all the empty at the beginning of the file using a regex
				data = data.replace(/^\s*\n/gm, "")

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

		checkForMarkdownHeader("README.md")

  } catch (error) {
    core.setFailed(error.message)
  }
})()
