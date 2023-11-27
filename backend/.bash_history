stages:          # List of stages for jobs, and their order of execution
  - test

unit-test-job:   # This job runs in the test stage.
  tags: [shared-docker-runner]
  image: node:20.8.0
  stage: test    # It only starts when the job in the build stage completes successfully.
  script:
    - cd backend
    - npm install
    - npm run start

