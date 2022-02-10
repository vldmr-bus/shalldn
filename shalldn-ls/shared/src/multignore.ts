import * as path from 'path';
import ignore, { Ignore } from 'ignore';
import { FsUtil } from './fsutil';

export default class MultIgnore {
	private testers: Map<string, Ignore> = new Map();
	private theTester?:Ignore;
	private theRoot = '';
	public add(root:string, ignores: string[]) {
		let it = this.testers.get(root);
		if (!it) {
			it = ignore();
			this.testers.set(root,it);
			if (!this.theTester) {
				this.theRoot = root;
				this.theTester = it;
			}
		}
		ignores.forEach(l => it?.add(l.replace(/\r/g, '').replace(/\\/g, '/').replace(/\/\/+/g, '/').split('\n').filter(s=>!s.startsWith('#') && s.trim().length!=0)))
	}

	public ignores(apath:string): boolean {
		if (this.testers.size == 0)
			return false;
		if (this.testers.size == 1) {
			let rp = path.relative(this.theRoot,apath);
			return this.theTester!.ignores(rp);
		}
		let result = false;
		for (let root of this.testers.keys()) {
			if (FsUtil.isInside(root, apath)) {
				let rp = path.relative(root, apath);
				let tester = this.testers.get(root);
				if ( (result = tester!.ignores(rp)) )
					break;
			}
		}
		return result;
	}
}