pipeline {

agent any

environment {

IMAGE = "pharmEasy-frontend:${BUILD_NUMBER}"

CONT = "pharmEasy-frontend"

}

stages {

stage('Checkout') {

steps { checkout scm }

}

stage('Build Docker Image') {

steps {

bat 'docker build -t ${IMAGE} .'

}

}

stage('Run Container') {

steps {

bat 'docker rm -f ${CONT} || true'

bat 'docker run -d --name ${CONT} -p 8081:80 ${IMAGE}'

}

}

}

}