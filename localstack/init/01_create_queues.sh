#!/usr/bin/env bash
set -x
awslocal sqs create-queue --queue-name kitchen-to-warehouse-queue
awslocal sqs create-queue --queue-name warehouse-to-kitchen-queue
