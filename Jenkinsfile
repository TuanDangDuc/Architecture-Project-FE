pipeline {
  agent {
    docker {
      image 'node:18'
    }

  }
  stages {
    stage('Checkout') {
      steps {
        git(branch: 'main', url: 'https://github.com/TuanDangDuc/Architecture-Project-FE.git')
      }
    }

    stage('build') {
      steps {
        sh 'rm -rf node_modules'
        sh 'rm -f package-lock.json'
        sh 'npm install --force'
        sh 'npm run build'
      }
    }

    stage('Publish image') {
      steps {
        script {
          docker.withRegistry('https://index.docker.io/v1/', 'dockerlogin') {
            def commitHash = env.GIT_COMMIT.take(7)
            def dockerImage = docker.build("ductuanbl2000/fe-architecture-app:${commitHash}", "./")
            dockerImage.push()
            dockerImage.push("latest")
            dockerImage.push("dev")
          }
        }

      }
    }

  }
  post {
    success {
      echo 'success'
    }

    failure {
      echo 'fail'
    }

  }
}
