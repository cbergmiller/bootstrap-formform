
QUnit.test( 'render test', function( assert ) {
	var fixture, form, fields, dom = {};

	fixture = $('#qunit-fixture');
	dom.form = fixture.find('form');

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
			name: 'fruit',
			label: 'Obst',
			choices: [
				['apple', 'Apfel'],
				['pear', 'Birne'],
				['orange', 'Orange']
			],
			type: 'selectmultiple2'
		}, {
			label: 'Anmelden',
			type: 'submit',
			class: 'btn-default',
			icon: 'ok'
		}
	];

	form = FormForm(dom.form, []);
	form.render();
	assert.expect(0);
});
