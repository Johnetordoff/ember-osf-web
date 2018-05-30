import { setupTest } from 'ember-osf-web/tests/helpers/osf-qunit';
import { module, test } from 'qunit';

module('Unit | Route | application', hooks => {
    setupTest(hooks);

    test('it exists', function(assert) {
        const route = this.owner.lookup('route:application');
        assert.ok(route);
    });
});
