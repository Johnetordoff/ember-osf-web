import pytest

from api.base.settings.defaults import API_BASE
from osf_tests.factories import (
    PreprintFactory,
    AuthUserFactory,
    InstitutionFactory,
)


@pytest.mark.django_db
class TestPreprintInstitutionsRelationship:
    """Test suite for managing preprint institution relationships."""

    @pytest.fixture()
    def user(self):
        return AuthUserFactory()

    @pytest.fixture()
    def admin_with_institutional_affilation(self, institution, preprint):
        user = AuthUserFactory()
        preprint.add_permission(user, 'admin')
        user.add_or_update_affiliated_institution(institution)
        return user

    @pytest.fixture()
    def no_auth_with_institutional_affilation(self, institution):
        user = AuthUserFactory()
        user.add_or_update_affiliated_institution(institution)
        user.save()
        return user

    @pytest.fixture()
    def admin_without_institutional_affilation(self, institution, preprint):
        user = AuthUserFactory()
        preprint.add_permission(user, 'admin')
        return user

    @pytest.fixture()
    def institutions(self):
        return [InstitutionFactory() for _ in range(3)]

    @pytest.fixture()
    def institution(self):
        return InstitutionFactory()

    @pytest.fixture()
    def preprint(self):
        return PreprintFactory()

    @pytest.fixture()
    def url(self, preprint):
        """Fixture that returns the URL for the preprint-institutions relationship endpoint."""
        return f'/{API_BASE}preprints/{preprint._id}/relationships/institutions/'

    def test_update_affiliated_institutions_add(self, app, user, admin_with_institutional_affilation, admin_without_institutional_affilation, preprint, url,
                                                institution):
        """
        Test adding affiliated institutions to a preprint.

        Verifies:
        - Unauthorized users cannot add institutions.
        - Admins without affiliation cannot add institutions.
        - Admins with affiliation can add institutions.
        """
        update_institutions_payload = {
            'data': [{'type': 'institutions', 'id': institution._id}]
        }

        res = app.put_json_api(
            url,
            update_institutions_payload,
            auth=user.auth,
            expect_errors=True
        )
        assert res.status_code == 403

        res = app.put_json_api(
            url,
            update_institutions_payload,
            auth=admin_without_institutional_affilation.auth,
            expect_errors=True
        )
        assert res.status_code == 403
        assert res.json['errors'][0]['detail'] == f'User needs to be affiliated with {institution.name}'

        res = app.put_json_api(
            url,
            update_institutions_payload,
            auth=admin_with_institutional_affilation.auth
        )
        assert res.status_code == 200

        preprint.reload()
        assert institution in preprint.affiliated_institutions.all()

        log = preprint.logs.latest()
        assert log.action == 'affiliated_institution_added'
        assert log.params['institution'] == {
            'id': institution._id,
            'name': institution.name
        }

    def test_update_affiliated_institutions_remove(self, app, user, admin_with_institutional_affilation, no_auth_with_institutional_affilation, admin_without_institutional_affilation, preprint, url,
                                                   institution):
        """
        Test removing affiliated institutions from a preprint.

        Verifies:
        - Unauthorized users cannot remove institutions.
        - Non-admin users cannot remove institutions.
        - Admins without affiliation can remove institutions.
        - Admins with affiliation can remove institutions.
        """
        preprint.affiliated_institutions.add(institution)
        preprint.save()

        update_institutions_payload = {
            'data': []
        }

        res = app.put_json_api(
            url,
            update_institutions_payload,
            auth=user.auth,
            expect_errors=True
        )
        assert res.status_code == 403

        res = app.put_json_api(
            url,
            update_institutions_payload,
            auth=no_auth_with_institutional_affilation.auth,
            expect_errors=True
        )
        assert res.status_code == 403

        res = app.put_json_api(
            url,
            update_institutions_payload,
            auth=admin_without_institutional_affilation.auth,
            expect_errors=True
        )
        assert res.status_code == 200  # you can always remove it you are an admin

        res = app.put_json_api(
            url,
            update_institutions_payload,
            auth=admin_with_institutional_affilation.auth
        )
        assert res.status_code == 200

        preprint.reload()
        assert institution not in preprint.affiliated_institutions.all()

        log = preprint.logs.latest()
        assert log.action == 'affiliated_institution_removed'
        assert log.params['institution'] == {
            'id': institution._id,
            'name': institution.name
        }

    def test_preprint_institutions_list_get(self, app, user, admin_with_institutional_affilation, admin_without_institutional_affilation, preprint, url,
                                            institution):
        """
        Test retrieving the list of affiliated institutions for a preprint.

        Verifies:
        - Unauthenticated users cannot retrieve the list.
        - Users without permissions cannot retrieve the list.
        - Admins without affiliation can retrieve the list.
        - Admins with affiliation can retrieve the list.
        """
        preprint.is_public = False
        preprint.save()

        res = app.get(url, expect_errors=True)
        assert res.status_code == 401

        res = app.get(url, auth=user.auth, expect_errors=True)
        assert res.status_code == 403

        res = app.get(url, auth=admin_without_institutional_affilation.auth, expect_errors=True)
        assert res.status_code == 200

        assert res.status_code == 200
        assert not res.json['data']

        preprint.add_affiliated_institution(institution, admin_with_institutional_affilation)
        res = app.get(url, auth=admin_with_institutional_affilation.auth)
        assert res.status_code == 200

        assert res.json['data'][0]['id'] == institution._id
        assert res.json['data'][0]['type'] == 'institutions'

    def test_post_affiliated_institutions(self, app, user, admin_with_institutional_affilation, preprint, url,
                                          institutions, institution):
        """
        Test that POST method is not allowed for affiliated institutions.

        Verifies:
        - POST requests return a 405 Method Not Allowed status.
        """
        add_institutions_payload = {
            'data': [{'type': 'institutions', 'id': institution._id} for institution in institutions]
        }

        res = app.post_json_api(
            url,
            add_institutions_payload,
            auth=admin_with_institutional_affilation.auth,
            expect_errors=True
        )
        assert res.status_code == 405

    def test_patch_affiliated_institutions(self, app, user, admin_with_institutional_affilation, preprint, url,
                                          institutions, institution):
        """
        Test that PATCH method is not allowed for affiliated institutions.

        Verifies:
        - PATCH requests return a 405 Method Not Allowed status.
        """
        add_institutions_payload = {
            'data': [{'type': 'institutions', 'id': institution._id} for institution in institutions]
        }

        res = app.patch_json_api(
            url,
            add_institutions_payload,
            auth=admin_with_institutional_affilation.auth,
            expect_errors=True
        )
        assert res.status_code == 405

    def test_delete_affiliated_institution(self, app, user, admin_with_institutional_affilation, admin_without_institutional_affilation, preprint, url,
                                           institution):
        """
        Test that DELETE method is not allowed for affiliated institutions.

        Verifies:
        - DELETE requests return a 405 Method Not Allowed status.
        """
        preprint.affiliated_institutions.add(institution)
        preprint.save()

        res = app.delete_json_api(
            url,
            {'data': [{'type': 'institutions', 'id': institution._id}]},
            auth=admin_with_institutional_affilation.auth,
            expect_errors=True
        )
        assert res.status_code == 405

    def test_add_multiple_institutions_affiliations(self, app, admin_with_institutional_affilation, admin_without_institutional_affilation, preprint, url,
                                                    institutions):
        """
        Test adding multiple institution affiliations to a preprint.

        Verifies:
        - Admins with multiple affiliations can add them to a preprint.
        """
        admin_with_institutional_affilation.add_or_update_affiliated_institution(institutions[0])
        admin_with_institutional_affilation.add_or_update_affiliated_institution(institutions[1])
        admin_with_institutional_affilation.add_or_update_affiliated_institution(institutions[2])
        admin_with_institutional_affilation.save()
        add_institutions_payload = {
            'data': [{'type': 'institutions', 'id': institution._id} for institution in institutions]
        }

        assert preprint.affiliated_institutions.all().count() == 0
        res = app.put_json_api(
            url,
            add_institutions_payload,
            auth=admin_with_institutional_affilation.auth,
        )
        assert res.status_code == 200
        assert preprint.affiliated_institutions.all().count() == 3

        preprint.reload()

    def test_remove_only_institutions_affiliations_that_user_has(self, app, user, admin_with_institutional_affilation, preprint, url,
                                                                 institutions, institution):
        """
        Test removing only institutions that the user is affiliated with from a preprint.

        Verifies:
        - Admins with multiple affiliations only remove their own affiliations, leaving others unchanged.
        """
        preprint.affiliated_institutions.add(*institutions)
        assert preprint.affiliated_institutions.all().count() == 3

        admin_with_institutional_affilation.add_or_update_affiliated_institution(institutions[0])
        admin_with_institutional_affilation.add_or_update_affiliated_institution(institutions[1])

        update_institution_payload = {
            'data': [{'type': 'institutions', 'id': institution._id}]
        }

        res = app.put_json_api(
            url,
            update_institution_payload,
            auth=admin_with_institutional_affilation.auth
        )
        assert res.status_code == 200
        assert preprint.affiliated_institutions.all().count() == 2
        assert institution in preprint.affiliated_institutions.all()
        assert institutions[2] in preprint.affiliated_institutions.all()