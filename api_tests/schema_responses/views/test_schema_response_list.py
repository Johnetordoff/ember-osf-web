import pytest

from osf_tests.factories import (
    AuthUserFactory,
    RegistrationFactory
)

from osf.models import SchemaResponse

@pytest.mark.django_db
class TestSchemaResponseList:

    @pytest.fixture()
    def user(self):
        return AuthUserFactory()

    @pytest.fixture()
    def registration(self):
        registration = RegistrationFactory()
        registration.update_moderation_state()
        return registration

    @pytest.fixture()
    def schema_response(self, registration):
        return registration.schema_responses.get()

    @pytest.fixture()
    def payload(self, registration):
        return {
            'data': {
                'type': 'schema-responses',
                'relationships': {
                    'registration': {
                        'data': {
                            'id': registration._id,
                            'type': 'registrations'
                        }
                    }
                }
            }
        }

    @pytest.fixture()
    def invalid_payload(self, registration):
        return {
            'data': {
                'type': 'schema-responses',
                'relationships': {
                    'registration': {
                        'data': {
                            'rogue_property': 'dsdas',
                            'type': 'not yours'
                        }
                    }
                }
            }
        }

    @pytest.fixture()
    def url(self):
        return '/v2/schema_responses/'

    def test_schema_response_list(self, app, registration, schema_response, user, url):
        resp = app.get(url, auth=user.auth)
        assert resp.status_code == 200
        data = resp.json['data']
        assert len(data) == 1
        assert registration.schema_responses.get()._id == data[0]['id']

    def test_schema_responses_list_create(self, app, registration, schema_response, payload, user, url):
        registration.add_contributor(user, 'admin')
        resp = app.post_json_api(url, payload, auth=user.auth)
        data = resp.json['data']
        assert resp.status_code == 201
        assert SchemaResponse.objects.count() == 2  # one approved on registration and this new one
        schema_response = SchemaResponse.objects.first()

        assert data['id'] == schema_response._id

    def test_schema_responses_list_create_validation(self, app, registration, invalid_payload, user, url):
        registration.add_contributor(user, 'admin')
        resp = app.post_json_api(url, invalid_payload, auth=user.auth, expect_errors=True)
        assert resp.status_code == 400
        assert "'not yours' does not match 'registrations'\n\nFailed validating 'pattern'" in resp.json['errors'][0]['detail']

    @pytest.mark.parametrize(
        'permission,expected_response',
        [
            (None, 200, ),
            ('read', 200, ),
            ('write', 200, ),
            ('admin', 200, ),
        ]
    )
    def test_schema_response_auth_get(self, app, registration, payload, permission, user, expected_response, url):
        if permission:
            registration.add_contributor(user, permission)
        resp = app.get(url, payload, auth=user.auth, expect_errors=True)
        assert resp.status_code == expected_response

    @pytest.mark.parametrize(
        'permission,expected_response',
        [
            (None, 403, ),
            ('read', 403, ),
            ('write', 403, ),
            ('admin', 201, ),
        ]
    )
    def test_schema_response_auth_post(self, app, registration, payload, permission, user, expected_response, url):
        if permission:
            registration.add_contributor(user, permission)
        resp = app.post_json_api(url, payload, auth=user.auth, expect_errors=True)
        assert resp.status_code == expected_response

    @pytest.mark.parametrize(
        'permission,expected_response',
        [
            (None, 405, ),
            ('read', 405, ),
            ('write', 405, ),
            ('admin', 405, ),
        ]
    )
    def test_schema_response_auth_patch(self, app, registration, payload, permission, user, expected_response, url):
        if permission:
            registration.add_contributor(user, permission)
        resp = app.patch_json_api(url, payload, auth=user.auth, expect_errors=True)
        assert resp.status_code == expected_response

    @pytest.mark.parametrize(
        'permission,expected_response',
        [
            (None, 405, ),
            ('read', 405, ),
            ('write', 405, ),
            ('admin', 405, ),
        ]
    )
    def test_schema_response_auth_delete(self, app, registration, payload, permission, user, expected_response, url):
        if permission:
            registration.add_contributor(user, permission)
        resp = app.delete_json_api(url, payload, auth=user.auth, expect_errors=True)
        assert resp.status_code == expected_response