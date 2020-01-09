import { action } from '@ember/object';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import DS from 'ember-data';

import Analytics from 'ember-osf-web/services/analytics';

import { DraftRoute } from 'registries/drafts/draft/navigation-manager';
import { DraftRouteModel } from '../route';

export default class DraftRegistrationReview extends Route {
    @service analytics!: Analytics;
    @service store!: DS.Store;
    @service router!: RouterService;

    model(): DraftRouteModel {
        const draftRouteModel = this.modelFor('drafts.draft') as DraftRouteModel;
        const { navigationManager } = draftRouteModel;

        navigationManager.setCurrentPage();
        navigationManager.setCurrentRoute(DraftRoute.Review);

        return this.modelFor('drafts.draft') as DraftRouteModel;
    }

    @action
    didTransition() {
        this.analytics.trackPage();
    }
}
