import Store from '@ember-data/store';
import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action } from '@ember/object';
import { alias, sort } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { restartableTask } from 'ember-concurrency';

import { BufferedChangeset } from 'ember-changeset/types';
import { taskFor } from 'ember-concurrency-ts';
import { layout } from 'ember-osf-web/decorators/component';
import DraftRegistration from 'ember-osf-web/models/draft-registration';
import License from 'ember-osf-web/models/license';
import { NodeLicense } from 'ember-osf-web/models/node';
import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import { LicenseManager } from 'registries/components/registries-license-picker/component';
import DraftRegistrationManager from 'registries/drafts/draft/draft-registration-manager';

import template from './template';

@tagName('')
@layout(template)
export default class LicensePickerManager extends Component implements LicenseManager {
    @service store!: Store;

    // required
    draftManager!: DraftRegistrationManager;

    licensesAcceptable!: QueryHasManyResult<License>;

    @alias('draftManager.metadataChangeset.license') selectedLicense!: License;

    @alias('draftManager.metadataChangeset') registration!: BufferedChangeset;
    @alias('draftManager.draftRegistration') draftRegistration!: DraftRegistration;

    @sort('selectedLicense.requiredFields', (a: string, b: string) => +(a > b))
    requiredFields!: string[];

    @restartableTask({ on: 'didReceiveAttrs' })
    @waitFor
    async getAllProviderLicenses() {
        const provider = await this.draftManager.draftRegistration.provider;

        if (!provider) {
            return;
        }

        const providerLicenses = await provider
            .queryHasMany('licensesAcceptable', {
                page: { size: 20 },
            });

        this.setProperties({
            licensesAcceptable: providerLicenses,
        });
    }

    setNodeLicenseDefaults(requiredFields: Array<keyof NodeLicense>): void {
        const nodeLicenseDefaults = {
            copyrightHolders: '',
            year: new Date().getUTCFullYear().toString(),
        };

        requiredFields.forEach(key => {
            const changesetValue = this.draftManager.metadataChangeset.get('nodeLicense')[key];
            this.draftManager.metadataChangeset.set(`nodeLicense.${key}`, changesetValue ?? nodeLicenseDefaults[key]);
        });
    }

    @action
    changeLicense(selected: License) {
        this.set('selectedLicense', selected);
        this.setNodeLicenseDefaults(selected.requiredFields);
    }

    @action
    onInput() {
        taskFor(this.draftManager.onMetadataInput).perform();
    }

    @action
    updateNodeLicense(key: string, event: Event) {
        const target = event.target as HTMLInputElement;
        this.draftManager.metadataChangeset.set(`nodeLicense.${key}`, target.value);
        this.onInput();
    }
}
