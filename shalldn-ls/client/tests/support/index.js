/* --------------------------------------------------------------------------------------------
 * Copyright (c) Vladimir Avdonin. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

Object.defineProperty(exports, "__esModule", { value: true });
exports.run = async function run() {
	const Cli = require("@cucumber/cucumber").Cli;
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
	if (process.env.CUCUMBER_TEST_NAME)
		argv = argv.concat(['--name', process.env.CUCUMBER_TEST_NAME ]);
	let cli = new Cli({argv,cwd,stdout});

	try {
		let result = await cli.run();
	} catch (error) {
		console.log(error);
	}

}