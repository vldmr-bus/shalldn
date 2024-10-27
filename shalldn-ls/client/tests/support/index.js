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
	const process = require("process");
	if (!process.env.CODE_TESTS_WORKSPACE)
		process.env.CODE_TESTS_WORKSPACE = path.resolve(cwd,'../../testFixture');
	if (!process.env.CODE_TESTS_PATH)
		process.env.CODE_TESTS_PATH = __dirname;
	let argv = [
		"node",
		"cucumber-js",
		cwd,
	]
		.concat(`--require-module ts-node/register -r support/*.ts`.split(' '));
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