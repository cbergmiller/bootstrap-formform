/// <reference path="definitions/jquery.d.ts" />

interface FieldConfig {
	type: string;
	name?: string;
	label?: string;
	addonPrepend?: string;
	addonAppend?: string;
	cls?: string;
	id?: string;
	value?: any;
	choices?: Array<Array<string>>;
}

declare class FormForm {
	isHorizontal: boolean;
	col1: number;
	col2: number;
	fields: Array<FieldConfig>;
	dom: JQuery;

    constructor(dom: JQuery, fields:Array<FieldConfig>);

    render(): void;
}
