# CREATE SQS LOCALLY IN YOUR LOCALSTACK CONTAINER

docker exec -it localstack_service awslocal sqs create-queue --queue-name kitchen-to-warehouse-queue
docker exec -it localstack_service awslocal sqs create-queue --queue-name warehouse-to-kitchen-queue
