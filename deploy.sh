DEPLOY_BUCKET_NAME=${ALIS_APP_ID}-edge-deploy-bucket

aws --region us-east-1 cloudformation package \
    --template-file template.yaml \
    --s3-bucket $DEPLOY_BUCKET_NAME \
    --output-template-file packaged-template.yaml

aws --region us-east-1 cloudformation deploy \
  --template-file packaged-template.yaml \
  --s3-bucket $DEPLOY_BUCKET_NAME \
  --stack-name ${ALIS_APP_ID}-edge \
  --capabilities CAPABILITY_IAM
