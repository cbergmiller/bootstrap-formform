# Bootstrap-FormForm

Client-side form rendering for Bootstrap 3.

## Example

http://www.bergmiller.de/formform_demo.html

## Dependencies

- jQuery
- Underscore.js
- Select2 (optional)

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
		label: 'Anmelden',
		type: 'submit',
		class: 'btn-default',
		icon: 'ok'
	}
];

form = FormForm( $('form'), fields );
form.render();
```

## Automatic form generation with Django

Subclass JsModelForm and access the property json_form_fields on an instance.

## Options

### Horizontal forms

Set `form.isHorizontal = true` before rendering for horizontal forms.
