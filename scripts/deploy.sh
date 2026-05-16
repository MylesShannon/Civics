#!/usr/bin/env bash
set -euo pipefail

if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  . ./.env
  set +a
fi

: "${S3_BUCKET:?S3_BUCKET must be set (in .env or your shell, e.g. export S3_BUCKET=my-bucket)}"
: "${CLOUDFRONT_DISTRIBUTION_ID:?CLOUDFRONT_DISTRIBUTION_ID must be set}"

if [ ! -d dist ]; then
  echo "dist/ not found. Run 'yarn build' first." >&2
  exit 1
fi

PDF="2025-Civics-Test-128-Questions-and-Answers.pdf"

echo "Syncing hashed assets to s3://$S3_BUCKET (immutable cache)..."
aws s3 sync dist/ "s3://$S3_BUCKET/" \
  --delete \
  --exclude "index.html" \
  --exclude "$PDF" \
  --cache-control "public, max-age=31536000, immutable"

echo "Uploading index.html (no-cache)..."
aws s3 cp dist/index.html "s3://$S3_BUCKET/index.html" \
  --cache-control "no-cache, no-store, must-revalidate" \
  --content-type "text/html; charset=utf-8"

if [ -f "dist/$PDF" ]; then
  echo "Uploading PDF (1h cache)..."
  aws s3 cp "dist/$PDF" "s3://$S3_BUCKET/$PDF" \
    --cache-control "public, max-age=3600" \
    --content-type "application/pdf"
fi

echo "Invalidating CloudFront ($CLOUDFRONT_DISTRIBUTION_ID)..."
aws cloudfront create-invalidation \
  --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
  --paths "/index.html" "/$PDF" \
  --output text \
  --query 'Invalidation.{Id:Id,Status:Status}'

echo "Done."
