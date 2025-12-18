#!/bin/bash

# AWS Cost Checker Script
# This script helps you monitor your AWS usage

echo "=== AWS Cost Monitoring ==="
echo ""

# Check if AWS CLI is configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS CLI not configured. Run 'aws configure' first."
    exit 1
fi

echo "✅ AWS CLI is configured"
echo ""

# Get current month's estimated charges
echo "📊 Current Month Estimated Charges:"
aws ce get-cost-and-usage \
    --time-period Start=$(date -u +%Y-%m-01),End=$(date -u +%Y-%m-%d) \
    --granularity MONTHLY \
    --metrics BlendedCost \
    --query 'ResultsByTime[0].Total.BlendedCost.Amount' \
    --output text 2>/dev/null || echo "Unable to fetch costs (may need additional permissions)"

echo ""
echo "💡 Tips:"
echo "  - Check AWS Billing Dashboard: https://console.aws.amazon.com/billing/"
echo "  - Set up billing alerts in CloudWatch"
echo "  - Delete unused resources regularly"
echo "  - Use 'serverless remove' to clean up deployments"

