pipeline {
    agent any

    environment {
        IMAGE_NAME = 'pharmeasy-frontend'
        IMAGE_TAG = 'latest'
        CONTAINER_NAME = 'pharmeasy-frontend'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t %IMAGE_NAME%:%IMAGE_TAG% .'
            }
        }

        stage('Remove Existing Container') {
            steps {
                bat '''
                docker stop %CONTAINER_NAME% 2>nul
                docker rm %CONTAINER_NAME% 2>nul
                '''
            }
        }

        stage('Run Container') {
            steps {
                bat 'docker run -d --name %CONTAINER_NAME% -p 4200:80 %IMAGE_NAME%:%IMAGE_TAG%'
            }
        }
    }
}