
from rest_framework import generics, permissions as drf_permissions
from django.db.models import Q

from api.base import permissions as base_permissions
from api.base.filters import ListFilterMixin
from api.base.views import JSONAPIBaseView
from api.base.utils import get_object_or_error
from api.base.versioning import PrivateVersioning
from api.meetings.serializers import MeetingSerializer, MeetingSubmissionSerializer
from api.meetings.permissions import IsPublic

from framework.auth.oauth_scopes import CoreScopes

from osf.models import AbstractNode, Conference, Tag


class MeetingMixin(object):
    """Mixin with convenience method get_meeting
    """

    meeting_lookup_url_kwarg = 'meeting_id'

    def get_meeting(self):
        meeting = get_object_or_error(
            Conference,
            Q(endpoint=self.kwargs[self.meeting_lookup_url_kwarg]),
            self.request,
            display_name='meeting',
        )
        return meeting

    def get_submissions(self):
        conference = self.get_meeting()
        tags = Tag.objects.filter(system=False, name__iexact=conference.endpoint).values_list('pk', flat=True)
        return AbstractNode.objects.filter(tags__in=tags, is_public=True, is_deleted=False)


class MeetingList(JSONAPIBaseView, generics.ListAPIView, ListFilterMixin):
    """The documentation for this endpoint can be found [here](https://developer.osf.io/#operation/meetings_list).
    """
    permission_classes = (
        drf_permissions.IsAuthenticatedOrReadOnly,
        base_permissions.TokenHasScope,
    )

    required_read_scopes = [CoreScopes.MEETINGS_READ]
    required_write_scopes = [CoreScopes.NULL]
    model = Conference

    # This view goes under the _/ namespace
    versioning_class = PrivateVersioning

    serializer_class = MeetingSerializer
    view_category = 'meetings'
    view_name = 'meeting-list'

    ordering = ('-modified', )  # default ordering

    # overrides ListFilterMixin
    def get_default_queryset(self):
        return Conference.objects.filter(is_meeting=True)

    # overrides ListAPIView
    def get_queryset(self):
        return self.get_queryset_from_request()


class MeetingDetail(JSONAPIBaseView, generics.RetrieveAPIView, MeetingMixin):
    """The documentation for this endpoint can be found [here](https://developer.osf.io/#operation/meetings_detail).
    """
    permission_classes = (
        drf_permissions.IsAuthenticatedOrReadOnly,
        base_permissions.TokenHasScope,
    )

    required_read_scopes = [CoreScopes.MEETINGS_READ]
    required_write_scopes = [CoreScopes.NULL]
    model = Conference

    # This view goes under the _/ namespace
    versioning_class = PrivateVersioning

    serializer_class = MeetingSerializer
    view_category = 'meetings'
    view_name = 'meeting-detail'

    def get_object(self):
        return self.get_meeting()


class MeetingSubmissionList(JSONAPIBaseView, generics.ListAPIView, MeetingMixin, ListFilterMixin):
    """The documentation for this endpoint can be found [here](https://developer.osf.io/#operation/meetings_submission_list).
    """
    permission_classes = (
        drf_permissions.IsAuthenticatedOrReadOnly,
        base_permissions.TokenHasScope,
        IsPublic,
    )

    required_read_scopes = [CoreScopes.MEETINGS_READ, CoreScopes.NODE_BASE_READ]
    required_write_scopes = [CoreScopes.NULL]
    model = AbstractNode

    # This view goes under the _/ namespace
    versioning_class = PrivateVersioning

    serializer_class = MeetingSubmissionSerializer
    view_category = 'meetings'
    view_name = 'meeting-submissions'

    ordering = ('-modified', )  # default ordering

    # overrides ListFilterMixin
    def get_default_queryset(self):
        return self.get_submissions()

    # overrides ListAPIView
    def get_queryset(self):
        return self.get_queryset_from_request()
