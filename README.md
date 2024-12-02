# E-Commerce Application

## How to use

```bash
git clone https://github.com/durlavkalita/neophilic.git
cd neophilic
touch .env # check variables required from docker-compose.yml
docker-compose up -d # --build for fresh
docker-compose down # to stop
```
---

## To-Do

### Basics
- [x] Frontend, Backend and db integration via Docker.
- [x] Image storage.
- [x] Track inventory records
- [x] Product Review system
- [ ] OTP based sign-in
- [ ] Payment gateway

### Codebase Review and Optimization
- [x] Review codebase for redundancy and clean up unnecessary code.
- [x] Ensure consistent and standardized error handling.
- [x] Implement logging for backend.
- [ ] Implement logging for frontend.
- [x] Optimize MongoDB queries and indexes for performance.

### Testing
- [x] Write unit tests for critical business logic and API endpoints.
- [x] Add integration tests to verify interactions between services.
- [ ] Implement end-to-end tests for user workflows (e.g., Cypress/Playwright).
- [ ] Perform load testing to evaluate performance under stress.
- [ ] Conduct security testing for potential vulnerabilities.

### Database Optimization
- [x] Set up proper indexing in MongoDB for commonly queried fields.
- [ ] Enable automated database backups.
- [ ] Test database restoration processes.
- [ ] Explore MongoDB sharding and replication for scalability and availability.

### Security Enhancements
- [x] Verify strict role-based authentication and authorization.
- [ ] Use secrets management for environment variables (e.g., AWS Secrets Manager).
- [ ] Enforce HTTPS with SSL/TLS certificates.
- [x] Implement rate limiting on API endpoints.
- [x] Double-check all input validation.
- [ ] Double-check all input sanitization.

### DevOps and Deployment
- [ ] Set up a CI/CD pipeline for automated deployments.
- [ ] Configure separate environments for development, staging, and production.
- [ ] Integrate monitoring tools (e.g., Prometheus, Grafana) for performance tracking.
- [ ] Review Docker Compose setup for scalability or transition to Kubernetes if needed.

### Frontend Optimization
- [x] Use Lighthouse to audit performance, accessibility, and SEO.
- [ ] Implement caching for static assets and configure a CDN.
- [ ] Test responsive design on multiple devices and screen sizes.

### Documentation
- [x] Finalize and publish Swagger or Postman collections for API documentation.
- [ ] Document the codebase for easier onboarding and maintenance.
- [ ] Create user guides for admin and customer workflows.

### Backup and Disaster Recovery
- [ ] Define and document a backup strategy for critical data and files.
- [ ] Create a disaster recovery plan, including failover strategies.

### Feedback Collection
- [ ] Integrate analytics tools (e.g., Google Analytics, Mixpanel) to track user behavior.
- [ ] Set up error reporting tools (e.g., Sentry) for frontend and backend.
- [ ] Add a feedback form for users to report issues or suggestions.

### Deployment Review
- [ ] Verify domain configuration for production deployment.
- [ ] Set up a load balancer.
- [ ] Review hosting.
