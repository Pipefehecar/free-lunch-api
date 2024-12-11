#!/bin/bash

echo "Creating DynamoDB tables..."

# Create inventory table
awslocal dynamodb create-table \
  --table-name inventory \
  --attribute-definitions AttributeName=ingredient,AttributeType=S \
  --key-schema AttributeName=ingredient,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

# Create purchases table
awslocal dynamodb create-table \
  --table-name purchases \
  --attribute-definitions \
    AttributeName=ingredient,AttributeType=S \
    AttributeName=timestamp,AttributeType=S \
  --key-schema \
    AttributeName=ingredient,KeyType=HASH \
    AttributeName=timestamp,KeyType=RANGE \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

# Insert some sample data
awslocal dynamodb put-item \
  --table-name inventory \
  --item '{"ingredient": {"S": "tomato"}, "quantity": {"N": "10"}}'

awslocal dynamodb put-item \
  --table-name inventory \
  --item '{"ingredient": {"S": "meat"}, "quantity": {"N": "5"}}'

awslocal dynamodb put-item \
  --table-name purchases \
  --item '{"ingredient": {"S": "tomato"}, "timestamp": {"S": "2024-12-07T10:00:00Z"}, "quantity": {"N": "5"}}'

echo "DynamoDB tables created and populated successfully" 