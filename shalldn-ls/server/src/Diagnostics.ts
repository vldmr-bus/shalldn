import { Diagnostic, DiagnosticRelatedInformation, DiagnosticSeverity, DocumentUri, Position, Range, uinteger } from 'vscode-languageserver-types';

export namespace Diagnostics {
	export class ShalldnDiagnostic implements Diagnostic {
		constructor(
			public severity: DiagnosticSeverity,
			public range : Range,
			public message: string
		){}
		relatedInformation?: DiagnosticRelatedInformation[];
		public get source():string {return 'Shalldn';}
		public addRelated(message: string, uri?: DocumentUri): ShalldnDiagnostic {
			if (uri === undefined)
				uri = "";
			if (this.relatedInformation === undefined)
				this.relatedInformation = [];
			this.relatedInformation.push({
				location: { uri, range: Object.assign({}, this.range) },
				message
			});
			return this;
		}
	}
	
	export function errorAtRange(message: string, range:Range) {
		return new ShalldnDiagnostic(DiagnosticSeverity.Error, range, message);
	}

	export function error(message: string, start: Position, end?: Position): ShalldnDiagnostic {
		if (end === undefined)
			end = start;
		return errorAtRange(message, {start, end});
	}
	export function warning(message: string, start: Position, end?: Position): ShalldnDiagnostic {
		if (end === undefined)
			end = start;
		return new ShalldnDiagnostic(DiagnosticSeverity.Warning, { start, end }, message);
	}

}