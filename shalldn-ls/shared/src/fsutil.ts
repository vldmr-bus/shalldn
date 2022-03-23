import * as path from 'path';
import { fileURLToPath } from 'url';
export namespace FsUtil {
	export function isInside(dirpath:string, fpath:string) {
		if (fpath.startsWith('file:'))
			fpath = fileURLToPath(fpath);
		let rp = path.relative(dirpath, fpath);
		return rp && !rp.startsWith('..') && !path.isAbsolute(rp);
	}
}