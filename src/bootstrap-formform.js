/*
 * Bootstrap-FormForm
 * Christian Bergmiller 2015
 * https://github.com/cbergmiller/bootstrap-formform
 *
 * fields = [
 *    {
 * 		name: '',
 * 		label: '',
 * 		type: 'select',
 * 		'class': '',
 * 		id: null,
 * 		appendLabel: '',
 * 		default: '',
 * 		choices: []
 *    }
 * ];
*/

var FormForm = (function($) {
	return function(dom, fields) {
		var self = {};

		self.isHorizontal = false;
		self.fields = fields;
		self.dom = dom;
		self.templates= {
			group: _.template(
				'<div class="form-group">\
					<label for="<%= data.id %>"><%- data.label %></label>\
					<%= data.renderedData %>\
					<span class="help-block"></span>\
				</div>', {variable: 'data'}),
			horizontalGroup: _.template(
				'<div class="form-group">\
					<label class="col-sm-4 control-label" for="<%= data.id %>"><%- data.label %></label>\
					<div class="col-sm-8">\
						<%= data.renderedData %>\
					</div>\
					<div class="col-sm-4"></div>\
					<div class="col-sm-8">\
						<span class="help-block" style="margin: 0"></span>\
					</div>\
				</div>', {variable: 'data'}),
			horizontalOffsetGroup: _.template(
				'<div class="form-group">\
					<div class="col-sm-offset-4 col-sm-8">\
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
				'<input type="<%= data.type %>" name="<%= data.name %>" class="form-control" id="<%= data.id %>" />'
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
						<input type="checkbox" name="<%= data.name %>"> <%- data.label %>\
					</label>\
				</div>', {variable: 'data'}),
			button: _.template(
				'<button type="<%= data.type %>" class="btn <%= data.class %>">\
					<% if (data.icon) { %><span class="glyphicon glyphicon-<%= data.icon %>"></span><% } %>\
					<span><%- data.label %></span>\
				</button>', {variable: 'data'})
		}; // ToDo: variable grid, addon

		/**
		 * Render the Form and attach it to the DOM.
		 */
		self.render = function() {
			self._renderFields();
			self._renderButtons();
		};

		/**
		 * Render all buttons and attach them to the DOM.
		 * @private
		 */
		self._renderButtons = function() {
			var renderedButtons = '';

			_.each(self.fields, function(field) {
				if ( !_.contains( ['button', 'submit'], field.type ) ) return;
				renderedButtons += self.templates.button(field);
			});
			if (self.isHorizontal) {
				renderedButtons = self.templates.horizontalOffsetGroup({renderedData: renderedButtons})
			}
			self.dom.append(renderedButtons);
		};

		/**
		 * Render all form-fields and attach them to the DOM.
		 * @private
		 */
		self._renderFields = function() {
			_.each(self.fields, function(field) {
				var formField,
					inputTemplate,
					groupTemplate;

				// skip buttons
				if ( _.contains( ['button', 'submit'], field.type ) ) return;
				if (!field.id) field.id = _.uniqueId();
				inputTemplate = self._getInputTemplate(field);
				groupTemplate = self._getGroupTemplate(field);
				field.renderedData = inputTemplate(field);
				formField = $( groupTemplate(field) );

				// Select-Optionen Rendern
				if ( field.choices ) self._renderChoices(formField, field);
				// Initialen Wert setzten
				if ( _.has(field, 'value') && field.type != 'file' ) {
					formField.find('input, select, textarea').val(field.value);
				}
				self.dom.append(formField);
				if ( _.contains( ['select2', 'multiselect2'], field.type ) ) {
					formField.find('select').select2({
						theme: 'bootstrap'
					});
				}
			});
		};

		/**
		 * Get the matching template for a form-field.
		 */
		self._getInputTemplate = function(field) {
			if ( _.contains(['text', 'password'], field.type) ) {
				return self.templates.input;
			} else if ( _.has(self.templates, field.type) ) {
				return self.templates[field.type]
			} else  if ( field.type == 'select2') {
				return self.templates['select']
			} else  if ( field.type == 'multiselect2') {
				return self.templates['multiselect']
			} else {
				throw 'Unkown field type: ' + field.type;
			}
		};

		/**
		 * Get the matching template for a form-group.
		 */
		self._getGroupTemplate = function(field) {
			if ( field.type == 'checkbox') {
				if (self.isHorizontal) {
					return self.templates.horizontalOffsetGroup
				} else {
					return function(field) {
						return field.renderedInput
					}
				}
			} else if (self.isHorizontal) {
				return self.templates.horizontalGroup
			} else {
				return self.templates.group
			}
		};

		/*
		 * Render options for a select-box
		 */
		self._renderChoices = function (formField, field) {
			var select;

			select = formField.find('select');
			if ( _.isArray( field.choices[0][1] ) ) {
				select.html(self.templates.optGroups(field.choices));
			} else {
				select.html(self.templates.options(field.choices));
			}
		};

		/**
		 * Get the field config object by name.
		 */
		self.getFieldByName = function(name) {
			return _.find( self.fields, function(field) {
				return field.name == name
			})
		};

		/*
		 * Reset the form to default values.
		 */
		self.reset = function() {

		};

		/*
		 * Setze alle Formularfelder auf die Werte aus dem Objekt.
		 */
		self.update = function(obj) {

		};

		return self
	};
})(jQuery);
