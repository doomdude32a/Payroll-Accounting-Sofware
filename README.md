# Personal-Website-
Website about myself

In this repo there is going to be a website about myself. There are two goals: 

1. Create a Website about myself that list my expirience/projects etc. which I can share when I am sending out my cv's. 

2. A CI/CD Pipline that test and deploys my website


# Personal Werbsite 
- About Me
- Skills 
- Expirience 
- Project 
- Etc....


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
