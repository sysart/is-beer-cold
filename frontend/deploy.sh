#!/usr/bin/env bash
CLIENT_BUCKET_DEV="kalja.sysart.io"
CLIENT_DISTRIBUTION_DEV="E35111130LCHFI"

npm i
npm run build

echo Deploying client to $CLIENT_BUCKET_DEV
aws s3 rm s3://$CLIENT_BUCKET_DEV --recursive # Delete existing deployment.
aws s3 cp ./build/ s3://$CLIENT_BUCKET_DEV --recursive --acl public-read
aws cloudfront create-invalidation --distribution-id $CLIENT_DISTRIBUTION_DEV --paths "/*"