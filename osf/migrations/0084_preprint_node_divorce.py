# -*- coding: utf-8 -*-
# Generated by Django 1.11.9 on 2018-03-12 18:25
from __future__ import unicode_literals

from django.db import migrations
from django.db.models import F
from itertools import islice


def divorce_preprints_from_nodes(apps, schema_editor):
    Preprint = apps.get_model('osf', 'PreprintService')
    PreprintContributor = apps.get_model('osf', 'PreprintContributor')
    # tried to use F() function here but F() doesn't support table joins
    # instead, using the following to make this transaction atomic

    Preprint.objects.filter(node__isnull=False).select_related(
        'node', 'node__creator', 'node__title', 'node__description'
    ).update(title=F('node__title'), description=F('node__description'), creator=F('node__creator'))

    contributors = []

    for preprint in Preprint.objects.filter(node__isnull=False):
        # use bulk create
        admin = []
        write = []
        read = []
        for contrib in preprint.node.contributor_set.all():
            # make a PreprintContributor that points to the pp instead of the node
            # because there's a throughtable, relations are designated
            # solely on the through model, and adds on the related models
            # are not required.

            new_contrib = PreprintContributor(
                preprint=preprint,
                user=contrib.user,
                read=contrib.read,
                write=contrib.write,
                admin=contrib.admin,
                visible=contrib.visible
            )
            contributors.append(new_contrib)
            if contrib.admin:
                admin.append(contrib.user)
            elif contrib.write:
                write.append(contrib.user)
            else:
                read.append(contrib.user)
        preprint.get_group('admin').user_set.add(admin)
        preprint.get_group('write').user_set.add(write)
        preprint.get_group('read').user_set.add(read)
        preprint.save()

    batch_size = 1000
    while True:
        batch = list(islice(contributors, batch_size))
        if not batch:
            break
        PreprintContributor.objects.bulk_create(batch, batch_size)


class Migration(migrations.Migration):

    dependencies = [
        ('osf', '0083_update_preprint_model_for_divorce'),
    ]

    operations = [
        migrations.RunPython(divorce_preprints_from_nodes)
    ]
