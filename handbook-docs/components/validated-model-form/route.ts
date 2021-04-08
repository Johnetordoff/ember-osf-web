import { computed } from '@ember/object';
import Route from '@ember/routing/route';
import { task } from 'ember-concurrency';
import ConfirmationMixin from 'ember-onbeforeunload/mixins/confirmation';

import ValidatedModelFormController from './controller';

export default class ValidatedModelFormRoute extends Route.extend(ConfirmationMixin) {
<<<<<<< HEAD
    @task({ withTestWaiter: true })
    modelTask = task(function *(this: ValidatedModelFormRoute) {
        return yield this.store.findRecord('node', 'extng');
    });
=======
    @task
    async modelTask() {
        const node = await this.store.findRecord('node', 'extng');
        return node;
    }
>>>>>>> 74cd086b7... Remove withTestWaiter flag

    model() {
        return {
            taskInstance: this.modelTask.perform(),
        };
    }

    // BEGIN-SNIPPET validated-model-form.route.ts
    // This tells ember-onbeforeupload's ConfirmationMixin whether or not to stop transitions
    @computed('controller.isDirty')
    get isPageDirty() {
        const controller = this.controller as ValidatedModelFormController;
        return () => controller.get('isDirty');
    }
    // END-SNIPPET
}