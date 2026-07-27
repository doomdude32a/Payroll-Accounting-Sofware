# Personal-Website-
Website about myself

In this repo there is going to be a website about myself. There are two goals: 

1. Create a Application that does the Payroll Accounting

2. A CI/CD Pipline that test and deploys my website


# Application 
....

# CI/CD Pipeline 

                GitHub
                   │
        Push to feature branch
                   │
        GitHub Actions (CI)
      ┌─────────────────────┐
      │ Install dependencies│
      │ Run lint            │
      │ Run tests           │
      │ Build website       │
      └─────────────────────┘
                   │
           Merge into main
                   │
             Jenkins (CD)
      ┌─────────────────────┐
      │ Pull latest code    │
      │ Build Docker image  │
      │ Deploy container    │
      │ Restart website     │
      └─────────────────────┘
                   │
             Personal Website
