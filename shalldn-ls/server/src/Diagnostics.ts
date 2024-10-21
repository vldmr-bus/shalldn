import { Diagnostic, DiagnosticRelatedInformation, DiagnosticSeverity, DocumentUri, Position, Range, uinteger } from 'vscode-languageserver-types';
import * as l10n from "@vscode/l10n";

export class ShalldnDiagnostic implements Diagnostic {
	constructor(
		public severity: DiagnosticSeverity,
		public range: Range,
		public message: string
	) { }
	relatedInformation?: DiagnosticRelatedInformation[];
	public get source(): string { return l10n.t("Shalldn"); }
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
	public demote() {
		this.severity = this.severity == DiagnosticSeverity.Error ? DiagnosticSeverity.Warning : DiagnosticSeverity.Information;
	}
	public promote() {
		this.severity = this.severity == DiagnosticSeverity.Warning ? DiagnosticSeverity.Error : DiagnosticSeverity.Warning;
	}
}

export namespace Diagnostics {
	
	export function diagnostic(severity:DiagnosticSeverity, message: string, start: Position | Range, end?: Position): ShalldnDiagnostic {
		if ((<Range>start).end !== undefined)
			return new ShalldnDiagnostic(severity, <Range>start, message);
		if (end === undefined)
			end = <Position>start;
		return new ShalldnDiagnostic(severity, { start: <Position>start, end }, message);
	}

	export function error(message: string, start: Position|Range, end?: Position): ShalldnDiagnostic {
		return diagnostic(DiagnosticSeverity.Error,message,start,end);
	}

	export function warning(message: string, start: Position|Range, end?: Position): ShalldnDiagnostic {
		return diagnostic(DiagnosticSeverity.Warning, message, start, end);
	}

	export function info(message: string, start: Position|Range, end?: Position): ShalldnDiagnostic {
		return diagnostic(DiagnosticSeverity.Information, message, start, end);
	}

}