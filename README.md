# frontend-application
[![CircleCI](https://circleci.com/gh/AlisProject/frontend-application.svg?style=svg)](https://circleci.com/gh/AlisProject/frontend-application)

# Prerequisite 
- ndenv
- aws cli
- direnv
- docker

# Environment valuables
```bash
# Create .envrc to suit your environment.
cp -pr .envrc.sample .envrc
vi .envrc # edit

# allow
direnv allow
```

# Build and deployment

## Install dependencies
```bash
# install dependencies
ndenv install
```

## Deployment

```bash
./packaging.sh
./deploy.sh
```
