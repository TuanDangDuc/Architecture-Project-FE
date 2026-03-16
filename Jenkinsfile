pipeline {
    agent {
        docker { image 'node:18' }
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/TuanDangDuc/Architecture-Project-FE.git'
            }
        }

        stage('Build & Test') {
            steps {
                sh 'rm -rf node_modules package-lock.json'
                sh 'npm install'
                sh 'npm run build'
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
