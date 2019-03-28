# Serverless Edge

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
