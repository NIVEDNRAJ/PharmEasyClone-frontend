 pipeline {
 
agent any
 
environment {
 
IMAGE = "PharmEasy-frontend:${BUILD_NUMBER}"
 
CONT = "PharmEasy-frontend"
 
}
 
stages {
 
stage('Checkout') {
 
steps { checkout scm }
 
}
 
stage('Debug') {
    steps {
        bat 'echo IMAGE=%IMAGE%'
    }
}
 
stage('Build Docker Image') {
 
steps {
 
bat 'docker build -t %IMAGE% .'
 
}
 
}
 
stage('Run Container') {
 
steps {
 
bat 'docker rm -f %CONT% || true'
 
bat 'docker run -d --name %CONT% -p 4200:80 %IMAGE%'
 
}
 
}
 
}
}
 