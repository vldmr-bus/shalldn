/* --------------------------------------------------------------------------------------------
 * Copyright (c) Vladimir Avdonin. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = async function run() {
	const api = require('@cucumber/cucumber/api')
	const stdout = require("stream").PassThrough();
	stdout.on("data", src => {
		console.log(src.toString());
	}); 

	const path = require("path");
	const cwd = path.resolve(__dirname,"..");

	let provided = {
		requireModule: ['ts-node/register'],
		require: ['support/*.ts'],
		paths: ['./**/*.feature']
	}
	if (process.env.CUCUMBER_TEST_NAME)
		provided.name = [process.env.CUCUMBER_TEST_NAME];

	try {
		const { runConfiguration } = await api.loadConfiguration({ provided }, { cwd, stdout });
		const { success } = await api.runCucumber(runConfiguration,{cwd,stdout})
	} catch (error) {
		if (error.message)
			console.log(error.message);
		else
			console.log(error);
	} 

}