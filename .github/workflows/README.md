# GitHub Actions Workflow Setup

This workflow automatically deploys the application to Google Cloud Run when code is pushed to the `main` branch.

## Required GitHub Secrets

Before the workflow can run, you need to set up the following secrets in your GitHub repository:

1. **Go to your repository** → Settings → Secrets and variables → Actions

2. **Add these secrets:**

   - `GCP_SA_KEY`: Service Account JSON key for GCP authentication
     - How to create:
       ```bash
       # Create a service account
       gcloud iam service-accounts create github-actions \
         --display-name="GitHub Actions Service Account"
       
       # Grant necessary permissions
       gcloud projects add-iam-policy-binding second-broker-453715-e5 \
         --member="serviceAccount:github-actions@second-broker-453715-e5.iam.gserviceaccount.com" \
         --role="roles/run.admin"
       
       gcloud projects add-iam-policy-binding second-broker-453715-e5 \
         --member="serviceAccount:github-actions@second-broker-453715-e5.iam.gserviceaccount.com" \
         --role="roles/artifactregistry.writer"
       
       gcloud projects add-iam-policy-binding second-broker-453715-e5 \
         --member="serviceAccount:github-actions@second-broker-453715-e5.iam.gserviceaccount.com" \
         --role="roles/iam.serviceAccountUser"
       
       # Create and download the key
       gcloud iam service-accounts keys create key.json \
         --iam-account=github-actions@second-broker-453715-e5.iam.gserviceaccount.com
       
       # Copy the contents of key.json and add it as GCP_SA_KEY secret in GitHub
       ```

   - `NEXT_PUBLIC_X_API_KEY`: API key for the backend
     - Value: `5bb186bae06a2fd28eddb6a512f43dd2a3e62440d2242f9bda7bbbffa7f1ac11`

## Workflow Triggers

- **Automatic**: Pushes to `main` branch
- **Manual**: Go to Actions tab → "Deploy to Cloud Run" → "Run workflow"

## Workflow Steps

1. ✅ Checks out the code
2. ✅ Authenticates with Google Cloud
3. ✅ Builds Docker image
4. ✅ Pushes to Artifact Registry
5. ✅ Deploys to Cloud Run
6. ✅ Shows deployment URL

## Troubleshooting

- If authentication fails, check that `GCP_SA_KEY` secret is correctly set
- If deployment fails, check Cloud Run logs in GCP Console
- Ensure the Artifact Registry repository exists:
  ```bash
  gcloud artifacts repositories create oxtron-frontend-repo \
    --repository-format=docker \
    --location=us-central1 \
    --description="Frontend Docker images"
  ```

