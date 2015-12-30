# -*- coding: utf-8 -*-

import json
from django.forms import ModelForm
from django.db.models.fields.files import FieldFile
from .lazy_encoder import LazyEncoder


class JsModelForm(ModelForm):

	@property
	def form_fields(self):
		data = []
		for name, field in self.fields.iteritems():
			input_type = getattr(field.widget, 'input_type', field.widget.__class__.__name__.lower())
			f = {
				'name': name,
				'label': field.label,
				'type': input_type,
				'isRequired': field.required,
			}
			choices = getattr(field, 'choices', None)
			if choices:
				# ToDo: custom-exclude-list for QuerySet evaluation of models
				f['choices'] = list(choices)

			if self.instance:
				value = self.initial.get(name),
				if len(value) == 1:
					value = value[0]
				if isinstance(value, FieldFile):
					f['value'] = unicode(value)
				else:
					f['value'] = value
			data.append(f)
		return data

	@property
	def json_form_fields(self):
		return json.dumps(self.formFields, cls=LazyEncoder)
