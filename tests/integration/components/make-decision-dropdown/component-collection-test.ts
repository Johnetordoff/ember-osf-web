import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupIntl } from 'ember-intl/test-support';
import { TestContext } from 'ember-test-helpers';
import { setupRenderingTest } from 'ember-qunit';

import { CollectionSubmissionReviewStates } from 'ember-osf-web/models/collection-submission';
import { CollectionSubmissionActionTrigger } from 'ember-osf-web/models/collection-submission-action';
import { module, test } from 'qunit';
import { Permission } from 'ember-osf-web/models/osf-model';

module('Integration | Component | make-decision-dropdown | collection', hooks => {
    setupRenderingTest(hooks);
    setupIntl(hooks);
    setupMirage(hooks);

    // Object of all collection testcases as a constant
    const collectionSubmissionTestCases: {
        [key in CollectionSubmissionReviewStates]: {
            actions: CollectionSubmissionActionTrigger[],
            commentLabel?: string,
            commentPlaceholder?: string,
            checkboxLabel?: string[],
            checkboxDescription?: string[],
        }
    } = {
        [CollectionSubmissionReviewStates.Pending]: {
            actions: [CollectionSubmissionActionTrigger.Accept, CollectionSubmissionActionTrigger.Reject],
            commentLabel: 'Additional comment',
            commentPlaceholder: 'Add remarks to project admins',
            checkboxLabel: ['Accept Request', 'Reject Request'],
            // eslint-disable-next-line max-len
            checkboxDescription: ['Request will appear in search results and be associated with the collection' , 'Request will not appear in search results nor be associated with the collection'],
        },
        [CollectionSubmissionReviewStates.Accepted]: {
            actions: [CollectionSubmissionActionTrigger.Remove],
            commentLabel: 'Justification for Removal',
            commentPlaceholder: 'Provide justification for removal',
            checkboxLabel: ['Remove item'],
            // eslint-disable-next-line max-len
            checkboxDescription: ['Item will be removed from the collection and no longer appear in search results'],
        },
        [CollectionSubmissionReviewStates.InProgress]: {
            actions: [],
        },
        [CollectionSubmissionReviewStates.Rejected]: {
            actions: [],
        },
        [CollectionSubmissionReviewStates.Removed]: {
            actions: [],
        },
    };

    async function buildCollectionScenarios(
        testContext: TestContext,
        reviewsState: CollectionSubmissionReviewStates,
    ): Promise<void> {
        // Given the scenario needs to be created for a collection
        // to have a submission request in a certain review state

        // When the fixture loaded
        server.loadFixtures('licenses');
        // And a user is created
        const currentUser = server.create('user', 'loggedIn');
        // And licenses are addee
        const licensesAcceptable = server.schema.licenses.all().models;
        // And a collection provider is created
        const provider = server.create('collection-provider', 'currentUserIsModerator');
        // And a collection is added with the provider
        const mirageCollection = server.create('collection', {
            provider,
        });
        // And a node with a guid is created
        const guid = server.create('node', {
            license: licensesAcceptable[0],
            currentUserPermissions: [Permission.Admin],
        }, 'withContributors');

        // And a contributor is added
        server.create('contributor', {
            node: guid,
            users: currentUser,
            index: 0,
        });
        // And a moderator is assignede
        server.create('moderator', { provider });
        // And a collection submission is created
        const mirageSubmission = server.create('collection-submission', {
            id: guid.id,
            creator: currentUser,
            collection: mirageCollection,
            guid,
            reviewsState,
        });

        // And the collectionSubmission is stored in state
        const submissionId = mirageSubmission.id + '-' + mirageSubmission.id;
        const store = testContext.owner.lookup('service:store');
        const collectionSubmission = await store.findRecord('collection-submission', submissionId);
        testContext.set('collectionSubmission', collectionSubmission);
    }

    // Dynamic creating of all test cases based on the review states
    for (const reviewsState of (Object.keys(collectionSubmissionTestCases) as CollectionSubmissionReviewStates[])) {
        test(`shows actions for collection submission state: ${reviewsState}`,
            async function(this: TestContext, assert) {
                await buildCollectionScenarios(this, reviewsState);

                const testCase = collectionSubmissionTestCases[reviewsState];

                // Given the MakeDecisionDropdown is rendered
                await render(hbs`<MakeDecisionDropdown @collectionSubmission={{this.collectionSubmission}} />`);

                // When the dropdown button is clicked
                await click('[data-test-moderation-dropdown-button]');

                testCase.actions.forEach((actionTrigger: CollectionSubmissionActionTrigger, $index: number) => {
                    // Then the "actionTrigger" checkbox option is available
                    assert.dom(`[data-test-moderation-dropdown-decision-checkbox=${actionTrigger}]`)
                        .isVisible(`'${actionTrigger}' checkbox option is visible`);

                    // And the "actionTrigger" checkbox option is not checked
                    assert.dom(`[data-test-moderation-dropdown-decision-checkbox=${actionTrigger}]`)
                        .isNotChecked(`'${actionTrigger}' checkbox option is not checked by default`);

                    // And then "actionTrigger" checkbox label is verified
                    if (testCase.checkboxLabel?.length) {
                        const labelText = testCase.checkboxLabel[$index];
                        assert.dom(`[data-test-moderation-dropdown-decision-label=${actionTrigger}]`).hasText(
                            labelText,
                            'has the right action trigger description text',
                        );
                    }

                    // And the "actionTrigger" checkbox description is verified
                    if (testCase.checkboxDescription?.length) {
                        const descriptionText = testCase.checkboxDescription[$index];
                        assert.dom(`[data-test-moderation-dropdown-decision-description=${actionTrigger}]`).hasText(
                            descriptionText,
                            'has the right action trigger description text',
                        );
                    }
                });


                if (testCase.actions.length) {
                    assert.dom('[data-test-moderation-dropdown-action-label]')
                        .hasText(testCase.commentLabel!,
                            'Comment label has the right text');
                    assert.dom('[data-test-moderation-dropdown-comment]')
                        .hasAttribute('placeholder', testCase.commentPlaceholder!,
                            'Comment placeholder has the right text');
                    assert.dom('[data-test-moderation-dropdown-submit]')
                        .isDisabled('Submit button is disabled by default');
                } else {
                    assert.dom('[data-test-moderation-dropdown-comment]')
                        .doesNotExist('No actions in non-actionable states');
                    assert.dom('[data-test-moderation-dropdown-action-label]')
                        .doesNotExist('No comment label in non-actionable states');
                    assert.dom('[data-test-moderation-dropdown-submit]')
                        .doesNotExist('No submit button in non-actionable states');
                    assert.dom('[data-test-no-moderator-actions]')
                        .isVisible('No moderator action text in non-actionable states');
                }
            });
    }
});