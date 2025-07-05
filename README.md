# 🚀 Full Stack App – Bun + React + Express

This is a full-stack web application built with:

- ⚙️ **Backend**: Express (running with Bun)
- 🎨 **Frontend**: React (Vite + Bun)
- 🛡️ **Authentication**: JWT-based auth
- 🌐 **Ports**: Backend – `5000`, Frontend – `5173`

---
## Steps to run the project

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```
## For backend
```bash
bun install
bun index.js
```


## For Frontend
```bash
cd ../frontend
bun i
bun run dev
```



# pipleline README

This repository contains an automated CI/CD pipeline using **GitHub Actions** to deploy the `MemePool` project (Frontend + Backend + MongoDB) to an **Ubuntu EC2 server** via **Docker Compose**.

---

##  What This Pipeline Does

 On manual trigger:
- Builds env files from GitHub Secrets  
- Uploads code to EC2 (`/home/ubuntu/MemePool`)  
- Runs `docker-compose up` remotely to build and deploy containers  

---

##  Prerequisites

### 1.  EC2 Server Setup

Ensure your EC2 instance has the following installed:

```bash
sudo apt update
sudo apt install docker.io -y
sudo apt install docker-compose -y
