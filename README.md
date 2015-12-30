# bootstrap-formform

Client-side form rendering for Twitter-Bootstrap 3.

## usage

```javascript
var fields, form;

fields = [
	{
		name: 'name',
		label: 'Speichern',
		type: 'text'
	}, {
		name: 'password',
		label: 'Passwort',
		type: 'password'
	}, {
		name: 'save',
		label: 'Speichern',
		type: 'submit',
		icon: 'ok'
	}
];

form = FormForm( $('form'), fields );
form.render();
```

## Automatic form generation with Django

Subclass JsModelForm an access the property json_form_fields on an instance.
