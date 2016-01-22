/// <reference path="definitions/jquery.d.ts" />
/// <reference path="definitions/underscore.d.ts" />

/*
 * Bootstrap-FormForm
 * Christian Bergmiller 2015/2016
 * https://github.com/cbergmiller/bootstrap-formform
 *
 * fields = [
 *    {
 * 		name: '',
 * 		label: '',
 * 		addonPrepend: '',
 * 		addonAppend: '',
 * 		type: '',
 * 		'class': '',
 * 		id: null,
 * 		choices: []
 *    }
 * ];
*/


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

class FormForm {
	isHorizontal: boolean;
	col1: number;
	col2: number;
	fields: Array<FieldConfig>;
	dom: JQuery;

	static templates = {
		group: _.template(
			'<div class="form-group">\
				<label for="<%= data.id %>"><%- data.field.label %></label>\
				<%= data.renderedData %>\
				<span class="help-block"></span>\
			</div>', {variable: 'data'}),
		inputGroup: _.template(
			'<div class="input-group">\
				<% if (data.field.addonPrepend) { %>\
					<div class="input-group-addon"><%- data.field.addonPrepend %></div>\
				<% } %>\
				<%= data.renderedData %>\
				<% if (data.field.addonAppend) { %>\
					<div class="input-group-addon"><%- data.field.addonAppend %></div>\
				<% } %>\
			</div>', {variable: 'data'}),
		horizontalGroup: _.template(
			'<div class="form-group">\
				<label class="col-sm-<%= data.col1 %> control-label" for="<%= data.id %>"><%- data.field.label %></label>\
				<div class="col-sm-<%= data.col2 %>">\
					<%= data.renderedData %>\
				</div>\
				<div class="col-sm-<%= data.col1 %>"></div>\
				<div class="col-sm-<%= data.col2 %>">\
					<span class="help-block" style="margin: 0"></span>\
				</div>\
			</div>', {variable: 'data'}),
		horizontalOffsetGroup: _.template(
			'<div class="form-group">\
				<div class="col-sm-offset-<%= data.col1 %> col-sm-<%= data.col2 %>">\
					<%= data.renderedData %>\
				</div>\
			</div>', {variable: 'data'}),
		select: _.template(
			'<select name="<%= data.name %>" class="form-control" id="<%= data.id %>"></select>'
			, {variable: 'data'}),
		selectmultiple: _.template(
			'<select multiple="multiple" class="form-control" name="<%= data.name %>" id="<%= data.id %>"></select>'
			, {variable: 'data'}),
		input: _.template(
			'<input type="<%= data.type %>" name="<%= data.name %>" class="form-control" id="<%= data.id %>" <% if (data.value){ %>value="<%- data.value %>"<% } %>/>'
			, {variable: 'data'}),
		textarea: _.template(
			'<textarea name="<%= data.name %>" class="form-control" id="<%= data.id %>" rows="4"></textarea>'
			, {variable: 'data'}),
		file: _.template(
			'<div class="controls" style="height: 34px;">\
				<div class="fileinput <% if (data.value) { %>fileinput-exists<% } else { %>fileinput-new<% } %>" data-provides="fileinput">\
					<input id="<%= data.id %>-clear_id" name="<%= data.name %>-clear" type="checkbox">\
					<div class="input-group">\
						<div class="form-control uneditable-input" data-trigger="fileinput">\
							<span class="fileinput-filename"><%- data.value %></span>\
						</div>\
						<span class="input-group-addon btn btn-grey btn-file">\
							<span class="fileinput-new">select File</span>\
							<span class="fileinput-exists">\
								<span class="glyphicon glyphicon-file" style="margin-right: 0"></span>\
							</span>\
							<input type="file" id="<%= data.id %>" name="<%= data.name %>">\
						</span>\
						<a href="#" class="input-group-addon btn btn-grey fileinput-exists" data-dismiss="fileinput">\
							<span class="glyphicon glyphicon-remove" style="margin-right: 0"></span>\
						</a>\
					</div>\
				</div>\
			</div>', {variable: 'data'}),
		options: _.template(
			'<% _.each(choices, function(choice) { %>\
				<option value="<%= choice[0] %>"><%- choice[1] %></option>\
			<% }) %>', {variable: 'choices'}),
		optGroups: _.template(
			'<% _.each(choices, function(optgroup) { %>\
				<optgroup label="<%- optgroup[0] %>">\
					<% _.each(optgroup[1], function(choice) { %>\
						<option value="<%= choice[0] %>"><%- choice[1] %></option>\
					<% }) %>\
				</optgroup>\
			<% }) %>', {variable: 'choices'}),
		checkbox: _.template(
			'<div class="checkbox">\
				<label>\
					<input type="checkbox" name="<%= data.name %>" <% if (data.value){ %>checked="checked"<% } %>> <%- data.label %>\
				</label>\
			</div>', {variable: 'data'}),
		button: _.template(
			'<button type="<%= data.type %>" class="btn <%= data.cls %>">\
				<% if (data.icon) { %><span class="glyphicon glyphicon-<%= data.icon %>"></span><% } %>\
				<span><%- data.label %></span>\
			</button>', {variable: 'data'})
	};

	static typeConfig = {
		text: {
			template: FormForm.templates.input
		},
		password: {
			template: FormForm.templates.input
		},
		number: {
			template: FormForm.templates.input
		},
		hidden: {
			template: FormForm.templates.input
		},
		textarea: {
			template: FormForm.templates.textarea,
			value: true
		},
		checkboxinput: {
			template: FormForm.templates.checkbox
		},
		select: {
			template: FormForm.templates.select,
			value: true
		},
		selectmultiple: {
			template: FormForm.templates.selectmultiple,
			value: true
		},
		select2: {
			template: FormForm.templates.select,
			value: true,
			select2: true
		},
		selectmultiple2: {
			template: FormForm.templates.selectmultiple,
			value: true,
			select2: true
		},
		file: {
			template: FormForm.templates.file
		},
		button: {
			template: FormForm.templates.button
		},
		submit: {
			template: FormForm.templates.button
		}
	};

	constructor(dom:JQuery, fields:Array<FieldConfig>) {
		this.dom = dom;
		this.fields = fields;
		this.col1 = 4;
		this.col2 = 8;
		this.isHorizontal = dom.hasClass('form-horizontal');
	}

	/**
	 * Render the Form and attach it to the DOM.
	 */
	render():void {
		this._renderFields();
		this._renderButtons();
	}
	
	/**
	 * Render all buttons and attach them to the DOM.
	 * @private
	 */
	_renderButtons() {
		var renderedButtons = '';

		_.each(this.fields, function (field) {
			if (!_.contains(['button', 'submit'], field.type)) return;
			renderedButtons += FormForm.templates.button(field);
		});
		if (this.isHorizontal) {
			renderedButtons = FormForm.templates.horizontalOffsetGroup({
				renderedData: renderedButtons,
				col1: this.col1,
				col2: this.col2
			})
		}
		this.dom.append(renderedButtons);
	}

	/**
	 * Render all form-fields and attach them to the DOM.
	 * @private
	 */
	_renderFields() {
		var _this = this;
		_.each(this.fields, function (field) {
			var formField,
				inputTemplate,
				inputGroupTemplate,
				groupTemplate,
				typeConfig;

			// skip buttons
			if (_.contains(['button', 'submit'], field.type)) return;

			typeConfig = FormForm.typeConfig[field.type];
			if (!field.id) field.id = _.uniqueId('formform');
			inputTemplate = _this._getInputTemplate(field);
			inputGroupTemplate = _this._getInputGroupTemplate(field);
			groupTemplate = _this._getGroupTemplate(field);
			formField = $(
				groupTemplate({
					field: field,
					renderedData: inputGroupTemplate({
						field: field,
						renderedData: inputTemplate(field)
					}),
					col1: _this.col1,
					col2: _this.col2
				})
			);
			// Select-Optionen Rendern
			if (field.choices) _this._renderChoices(formField, field);
			// Initialen Wert setzten
			if (_.has(field, 'value') && typeConfig.value) {
				formField.find('input, select, textarea').val(field.value);
			}
			_this.dom.append(formField);
			if (typeConfig.select2) {
				formField.find('select').select2({theme: 'bootstrap'});
			}
		});
	}

	/**
	 * Get the matching template for a form-field.
	 */
	_getInputTemplate(field): (...data: any[]) => string {
		if (FormForm.typeConfig[field.type]) {
			return FormForm.typeConfig[field.type].template
		}
		throw 'Unkown field type: ' + field.type;
	}

	_getInputGroupTemplate(field): (...data: any[]) => string {
		if (field.addonPrepend || field.addonAppend) {
			return FormForm.templates.inputGroup
		} else {
			return function (field) {
				return field.renderedData
			}
		}
	}

	/**
	 * Get the matching template for a form-group.
	 */
	_getGroupTemplate(field): (...data: any[]) => string {
		if (field.type == 'checkboxinput' && this.isHorizontal) {
			return FormForm.templates.horizontalOffsetGroup
		} else if (_.contains(['checkboxinput', 'hidden'], field.type)) {
			// no form-group
			return function (data) {
				return data.renderedData
			}
		} else if (this.isHorizontal) {
			return FormForm.templates.horizontalGroup
		} else {
			return FormForm.templates.group
		}
	}

	/*
	 * Render options for a select-box
	 */
	_renderChoices(formField, field) {
		var select, choices;

		choices = field.choices;
		if (!_.isArray(choices) || !choices.length) return;
		select = formField.find('select');
		if (_.isArray(choices[0][1])) {
			select.html(FormForm.templates.optGroups(choices));
		} else {
			select.html(FormForm.templates.options(choices));
		}
	}

	/**
	 * Get the field config object by name.
	 */
	getFieldByName(name: string): FieldConfig {
		return _.find(this.fields, function (field) {
			return field.name == name
		})
	}

	/*
	 * Reset the form to default values.
	 */
	reset() {

	}

	/*
	 * Setze alle Formularfelder auf die Werte aus dem Objekt.
	 */
	update(obj) {

	}

}