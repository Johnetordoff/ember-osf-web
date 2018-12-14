# -*- coding: utf-8 -*-
# Generated by Django 1.11.9 on 2018-02-08 20:23
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('osf', '0080_add_abstractprovider'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='preprintprovider',
            options={'permissions': (('view_submissions', 'Can view all submissions to this provider'), ('add_moderator', 'Can add other users as moderators for this provider'), ('update_moderator', 'Can elevate or lower other moderators/admins'), ('view_actions', 'Can view actions on submissions to this provider'), ('add_reviewer', 'Can add other users as reviewers for this provider'), ('review_assigned_submissions', 'Can submit reviews for submissions to this provider which have been assigned to this user'), ('assign_reviewer', 'Can assign reviewers to review specific submissions to this provider'), ('remove_moderator', 'Can remove moderators from this provider. Implicitly granted to self'), ('set_up_moderation', 'Can set up moderation for this provider'), ('view_assigned_submissions', 'Can view submissions to this provider which have been assigned to this user'), ('edit_reviews_settings', 'Can edit reviews settings for this provider'), ('accept_submissions', 'Can accept submissions to this provider'), ('reject_submissions', 'Can reject submissions to this provider'), ('edit_review_comments', 'Can edit comments on actions for this provider'), ('view_preprintprovider', 'Can view preprint provider details'))},
        ),
    ]