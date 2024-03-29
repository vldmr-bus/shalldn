import 'mocha';
import * as assert from 'assert';
import * as path from 'path';
import * as fsp from "fs/promises";
import { URI } from 'vscode-uri';
import '../src/ShalldnProj';
import ShalldnProj, { AnalyzerPromise } from '../src/ShalldnProj';
import { Util } from '../src/util';
import { Trees } from '../../shared/lib/trees'

const root = path.resolve(__dirname,'../../testFixture');
const project = new ShalldnProj([root]);
project.setIgnores([]);

function analyzeFiles(files: string[]): AnalyzerPromise<string[]> {
	return project.analyzeFiles(files, (uri: string) => {
		let path = URI.parse(uri).fsPath;
		return fsp.readFile(path, 'utf8');
	});
}

let tree:Trees.NamespaceTree;

before(async function () {
	const uris:string[] = [];
	Util.findFiles(root, /\.shalldn/,(f)=>uris.push(URI.file(path.resolve(root,f)).toString()));
	await analyzeFiles(uris)
	.then(()=>analyzeFiles(uris))
	.then((files)=>{console.log(`Analyzed ${files.length} files`)});
	tree = project.getTagsTree();
});

function assertTag(tagName:string) {
	let node = tree.find(t => typeof t != 'string' && t.id == tagName);
	assert.notEqual(node, undefined, `There should be tag "${tagName}" in fixture`);
}

function assertTaggedRq(tagName: string, reqId: string) {
	let node = tree.find(t => typeof t != 'string' && t.id == tagName);
	if (!node)
		throw `There should be tag "${tagName}" in fixture`;
	if (typeof node == 'string') {
		assert.equal(node,reqId,`Expected requirement id ${reqId}, but found ${node}`);
		return;
	}
	let ids = Trees.getLeafs(node.children);
	assert.notEqual(ids.find(i=>i==`${tagName}.${reqId}`),undefined,`Requirement with id ${reqId} is not tagged with ${tagName}`);
}

describe('Analyzer', () =>{
	it ('shall find 3 tags in test fixture',()=>{
		assert.equal(tree.length,3,"There should be 3 tags requirements in fixture");
	});
	it('shall find "Tags_Tag1" in test fixture', () => assertTag("Tags_Tag1"));
	it('shall find "Tags_Tag2" in test fixture', () => assertTag("Tags_Tag2"));
	it('shall find "Tag_With_Value" in test fixture', () => assertTag("Tag_With_Value"));
	it('shall find requirement id "Test.Parser.IMPLMNT_GRP.Link" tagged with "Tags_Tag1" in test fixture', () => assertTaggedRq("Tags_Tag1","Test.Parser.IMPLMNT_GRP.Link"));
	it('shall find requirement id "Test.Parser.IMPLMNT_GRP.Link" tagged with "Tags_Tag2" in test fixture', () => assertTaggedRq("Tags_Tag2","Test.Parser.IMPLMNT_GRP.Link"));
	it('shall find requirement id "Test.Parser.IMPLMNT_GRP.References" tagged with "Tags_Tag1" in test fixture', () => assertTaggedRq("Tags_Tag2","Test.Parser.IMPLMNT_GRP.Link"));
	it('shall find requirement id "Test.Parser.WARN_RTNL" tagged with "Tags_Tag2" in test fixture', () => assertTaggedRq("Tags_Tag2","Test.Parser.IMPLMNT_GRP.Link"));
	it('shall find requirement id "Test.Parser.WARN_RTNL" tagged with "Tag_With_Value" in test fixture', () => assertTaggedRq("Tag_With_Value","Test.Parser.WARN_RTNL"));
});