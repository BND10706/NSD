name: Build and Deploy
on:
  push:
    branches:
      - main # replace with your default branch if not 'main'

jobs:
  build:
    runs-on: ubuntu-latest
    env:
      NEXT_PUBLIC_APIKEY: ${{ secrets.NEXT_PUBLIC_APIKEY }}
      NEXT_PUBLIC_AUTHDOMAIN: ${{ secrets.NEXT_PUBLIC_AUTHDOMAIN }}
      NEXT_PUBLIC_PROJECTID: ${{ secrets.NEXT_PUBLIC_PROJECTID }}
      NEXT_PUBLIC_STORAGEBUCKET: ${{ secrets.NEXT_PUBLIC_STORAGEBUCKET }}
      NEXT_PUBLIC_MESSAGINGSENDERID: ${{ secrets.NEXT_PUBLIC_MESSAGINGSENDERID }}
      NEXT_PUBLIC_APPID: ${{ secrets.NEXT_PUBLIC_APPID }}
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 20

      - name: Install Dependencies
        run: npm ci

      - name: Build
        run: npm run build
    outputs:
      page_url: ${{ steps.deployment.outputs.page_url }}

  deploy:
  permissions:
      packages: write
    environment:
      name: github-pages
      url: ${{ needs.build.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
