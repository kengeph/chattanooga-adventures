# Firebase Test Subdomain Setup Guide

Step-by-step instructions to get `test.chattanooga-adventures.com` live on Firebase Hosting.

---

## Step 1: Create the Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **Add project**
3. Name it `chattanooga-adventures` (or similar — this is just the project label)
4. Disable Google Analytics if you don't need it, then click **Create project**

---

## Step 2: Set Up the Test Hosting Site

1. In your Firebase project, go to **Build > Hosting** in the left sidebar
2. Click **Get started** and follow the prompts (you can skip the CLI steps for now)
3. You now have a default site (e.g., `chattanooga-adventures.web.app`)
4. Click **Add another site** at the bottom of the Hosting dashboard
5. Name the second site `chattanooga-adventures-test`
   - This creates `chattanooga-adventures-test.web.app`
   - This is the site that will serve `test.chattanooga-adventures.com`

> **Important:** Write down both site IDs. If they differ from `chattanooga-adventures` and `chattanooga-adventures-test`, update the values in `.firebaserc` in your repo to match.

---

## Step 3: Connect the Custom Domain in Firebase

1. On the Hosting dashboard, find the **chattanooga-adventures-test** site
2. Click **Add custom domain**
3. Enter: `test.chattanooga-adventures.com`
4. Firebase will show you DNS records to add — **keep this page open** while you do Step 4

Firebase will provide:

| Type | Host/Name | Value |
|------|-----------|-------|
| TXT  | `test`    | `firebase=...` (verification string) |

After verification, Firebase will then show:

| Type  | Host/Name | Value |
|-------|-----------|-------|
| CNAME | `test`    | `chattanooga-adventures-test.web.app` (or similar) |

---

## Step 4: Add DNS Records in Squarespace

1. Log in to [Squarespace](https://www.squarespace.com)
2. Go to **Settings > Domains > chattanooga-adventures.com > DNS Settings**
3. Add the **TXT record** Firebase gave you:
   - **Type:** TXT
   - **Host:** `test`
   - **Value:** The `firebase=...` string from Step 3
4. Click **Save**, then go back to the Firebase console and click **Verify**
5. Once verified, Firebase will show a **CNAME record** — add it in Squarespace:
   - **Type:** CNAME
   - **Host:** `test`
   - **Value:** The target Firebase provided (e.g., `chattanooga-adventures-test.web.app`)
6. Click **Save**

> **Do NOT remove** any existing DNS records for the root domain — those are still pointing to InfinityFree for production.

---

## Step 5: Wait for SSL Provisioning

- Firebase automatically provisions a free SSL certificate for the custom domain
- This can take **a few minutes up to 24 hours** depending on DNS propagation
- You can monitor the status on the Firebase Hosting dashboard — it will show "Needs setup" then "Connected"

---

## Step 6: Generate a Service Account Key for GitHub Actions

1. In Firebase Console, click the **gear icon** next to "Project Overview" > **Project settings**
2. Go to the **Service accounts** tab
3. Click **Generate new private key**
4. A JSON file will download — this is your service account key

---

## Step 7: Add the Secret to GitHub

1. Go to your repo on GitHub: `Settings > Secrets and variables > Actions`
2. Click **New repository secret**
3. **Name:** `FIREBASE_SERVICE_ACCOUNT`
4. **Value:** Paste the **entire contents** of the JSON file from Step 6
5. Click **Add secret**

---

## Step 8: Push the Test Branch

Run this from your local repo (you should already be on the `test` branch):

```
git push -u origin test
```

This will trigger the GitHub Actions workflow (`.github/workflows/firebase_deploy_test.yml`) which deploys to the test hosting site.

---

## Step 9: Verify

1. Check the GitHub Actions tab on your repo to confirm the deploy succeeded
2. Visit `https://test.chattanooga-adventures.com` in your browser
3. You should see your site with a valid SSL certificate

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Firebase says "Verification failed" | DNS records may not have propagated yet — wait 15-30 minutes and retry |
| GitHub Action fails with auth error | Double-check that `FIREBASE_SERVICE_ACCOUNT` contains the full JSON (including curly braces) |
| Site loads on `.web.app` but not custom domain | DNS propagation can take up to 24 hours — check with `nslookup test.chattanooga-adventures.com` |
| SSL certificate not provisioned | Firebase provisions SSL after DNS is verified — give it up to 24 hours |
