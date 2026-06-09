pipeline {
 
    agent any
 
    environment {
        IMAGE = "pharmeasy-frontend:${BUILD_NUMBER}"
        CONT = "pharmeasy-frontend"
        NETWORK = "pharmeasy-net"
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
 
        stage('Create Network') {
            steps {
                bat "docker network create %NETWORK% 2>nul || ver > nul"
            }
        }
 
        stage('Run Container') {
            steps {
                bat 'docker rm -f %CONT% 2>nul || ver > nul'
                bat 'docker run -d --name %CONT% --network %NETWORK% -p 8081:80 %IMAGE%'
            }
        }
 
    }
}