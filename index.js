const core = require('@actions/core');
const github = require('@actions/github');

(
	async () => {
		try {
			core.notice("Calling my action")
		} catch(error) {
			core.setFailed(error.message);
		}
	}
)();