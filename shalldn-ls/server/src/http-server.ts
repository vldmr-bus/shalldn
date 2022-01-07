import * as express from "express";
import * as os from "os";
import * as fs from "fs";
import * as fsp from "fs/promises";
import * as ignorer from 'ignore';
import { marked } from "marked";
import path = require('path');
import ShalldnProj, { AnalyzerPromise } from './ShalldnProj';
import { URI } from 'vscode-uri';

if (process.argv.length != 3) {
	process.stderr.write('Requires single argument: path to the root of shalldn project');
	process.exit(1);
}
	
const root = process.argv[2];

if (!fs.existsSync(root)) {
	process.stderr.write('Can not access directory '+root);
	process.exit(1);
}

function findFiles(dir:string, filter:RegExp, cb:(f:string)=>void) {
	var files = fs.readdirSync(dir);
	for (var i = 0; i < files.length; i++) {
		var fpath = path.join(dir, files[i]);
		var stat = fs.lstatSync(fpath);
		if (stat.isDirectory()) {
			findFiles(fpath,filter,cb);
		}
		else if (filter.test(fpath))
			cb(fpath);
	};
}

function analyzeFiles(files: string[]): AnalyzerPromise<string[]> {
	return project.analyzeFiles(files, (uri: string) => {
		let path = URI.parse(uri).fsPath;
		return fsp.readFile(path, 'utf8');
	});
}

const ignore = ignorer.default();
const ignores: string[] = [];
findFiles(root, /\.gitignore$/,fpath=>{
	let txt = fs.readFileSync(fpath).toString();
	let pfx = path.relative(root, path.dirname(fpath));
	if (pfx.length > 1)
		txt = txt.replace(/\r/g, '').replace(/^([^#].*)$/gm, `${pfx}$1`);
	ignores.push(txt);
})
ignores.forEach(txt => ignore.add(txt));

const project = new ShalldnProj([root]);
project.setIgnores(ignores);

const uris:string[] = [];
findFiles(root, /\.shalldn/,(f)=>uris.push(URI.file(path.resolve(root,f)).toString()));
analyzeFiles(uris)
.then(()=>analyzeFiles(uris))
.then((files)=>{console.log(`Analyzed ${files.length} files`)});

let watcher = fs.watch(root,{recursive:true,},(event,fpath)=>{
	if (!/.shalldn$/.test(fpath))
		return;
	let uri = URI.file(fpath).toString();
	if (event == 'rename')
		if (!fs.existsSync(fpath)) {
			project.remove(uri);
			return;
		}
	let linked = new Set<string>([uri, ...project.getLinked(uri)]);
	analyzeFiles([uri])
	.then(()=>{
		linked = new Set([...linked, ...project.getLinked(uri)]);
		return analyzeFiles([...linked]);
	})
	.then((files) => { console.log(`Analyzed ${files.length} files`) });
});

var app = express();

app.set('port', process.env.PORT || 3000);

app.get('*', (req,resp,next)=>{
	if (req.method !== 'GET') {
		next();
		return;
	}
	if (!req.path.endsWith('.shalldn')) {
		next();
		return;
	}
	let apath = path.resolve(root, req.path.replace(/^\/+/, ''))
	let md = project.expandMD(apath,root);
	let html = marked.parse(md);
	resp.send(html);
});

app.listen(app.get('port'), function () {
	var h = (app.get('host') || os.hostname() || 'unknown') + ':' + app.get('port');
	console.log('Express server listening at ' + h);
});