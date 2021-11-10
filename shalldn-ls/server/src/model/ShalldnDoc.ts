import { TitleContext } from '../antlr/shalldnParser';
import ShalldnRequirement from './ShalldnRequirement';

export default class ShalldnDoc {
	private title: TitleContext = null as any;
	private requirements:ShalldnRequirement[]=[];
	constructor (

	) {}

	public addRequirement(rq:ShalldnRequirement) {
		this.requirements.push(rq);
	}

	public setTitle(ctx: TitleContext) {
		this.title = ctx;
	}

	public get subject() {
		return this.title && this.title._subject.text || null;
	}
}