pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/TuanDangDuc/Architecture-Project-FE.git'
            }
        }

        stage('Build & Test') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh 'docker build -t $IMAGE_NAME:$BUILD_NUMBER .'
                }
            }
        }
    }
    post {
          success {
              echo "success"
          }
          failure {
              echo "fail"
          }
      }
}
