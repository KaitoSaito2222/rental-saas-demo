# infra-and-cicd checklist

- [ ] infra/main.tf, variables.tf, outputs.tf are present.
- [ ] Canada data residency requirement is documented in infra comments.
- [ ] CI workflow runs lint, test, and build.
- [ ] Terraform workflow runs plan and controlled apply.
- [ ] Deployment workflow separates staging and production behavior.
- [ ] Required repository secrets are documented.
- [ ] Rollback path is documented and tested at least once.
- [ ] README deployment section references workflows and infra paths.