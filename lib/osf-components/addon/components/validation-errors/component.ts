import { assert } from '@ember/debug';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import Component from '@glimmer/component';
import { RawValidationResult } from 'ember-changeset-validations/utils/validation-errors';
import { BufferedChangeset } from 'ember-changeset/types';
import Intl from 'ember-intl/services/intl';

interface Args {
    changeset?: BufferedChangeset;
    key?: string;
    errors?: string | string[];
    isValidating?: boolean;
}

export default class ValidationErrors extends Component<Args> {
    @service intl!: Intl;

    constructor(owner: unknown, args: Args) {
        super(owner, args);
        const { changeset, key, errors } = args;

        assert('validation-errors - requires (@changeset and @key!) or @errors',
            Boolean(changeset && key) || !isEmpty(errors));

    }

    get isValidating() {
        const { changeset, key, isValidating } = this.args;
        return isValidating ?? changeset?.isValidating(key);
    }

    get cpValidationErrors() {
        // TODO: remove when we get rid of ember-cp-validations.
        const { errors } = this.args;
        if (errors) {
            if (Array.isArray(errors) && errors.every(error => typeof error === 'string')) {
                // default validator messages from ember-cp-validations
                return errors;
            }
            if (typeof errors === 'string') {
                // custom validators that use createErrorMessage...
                // (and extend ember-cp-validations/validators/base) return a translated string.
                return [errors];
            }
        }
        return [];
    }

    get changesetValidationErrors() {
        const { changeset, key } = this.args;
        if (changeset && key && isEmpty(this.cpValidationErrors)) {
            const errors = changeset.get(`error.${key}`);
            let validatorErrors: RawValidationResult[] = errors ? errors.validation : [];
            if (errors && errors.validation && !Array.isArray(errors.validation)) {
                validatorErrors = [errors.validation];
            }

            if (validatorErrors) {
                return validatorErrors.map(
                    ({ context: { type, translationArgs } }) => this.intl.t(
                        `validationErrors.${type}`, { ...translationArgs },
                    ),
                );
            }
        }
        return [];
    }

    get validatorErrors() {
        const { cpValidationErrors, changesetValidationErrors } = this;
        return isEmpty(cpValidationErrors) ? changesetValidationErrors : cpValidationErrors;
    }
}
