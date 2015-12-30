# bootstrap-formform

Client-side form rendering for Twitter-Bootstrap 3.

## Dependencies

jQuery
Underscore.js

## Usage

```javascript
var fields, form;

fields = [
	{
		name: 'username',
		label: 'Benutzername',
		type: 'text'
	}, {
		name: 'password',
		label: 'Passwort',
		type: 'password'
	}, {
		name: 'login',
		label: 'Anmelden',
		type: 'submit',
		icon: 'ok'
	}
];

form = FormForm( $('form'), fields );
form.render();
```

## Automatic form generation with Django

Subclass JsModelForm an access the property json_form_fields on an instance.

## Options

### Horizontal forms

Set `form.isHorizontal = true` before rendering for horizontal forms.
