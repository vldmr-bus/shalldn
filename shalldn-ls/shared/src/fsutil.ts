import * as path from 'path';

export namespace FsUtil {
	export function isInside(dirpath:string, fpath:string) {
		let rp = path.relative(dirpath, fpath);
		return rp && !rp.startsWith('..') && !path.isAbsolute(rp);
	}
}