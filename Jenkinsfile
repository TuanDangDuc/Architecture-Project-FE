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

    stage('Install dependencies') {
      steps {
        sh '''
          rm -rf node_modules
          npm install
          npm rebuild
        '''
      }
    }

    stage('Build project') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Publish Docker image') {
      steps {
        script {
          docker.withRegistry('https://index.docker.io/v1/', 'dockerlogin') {

            def commitHash = env.GIT_COMMIT.take(7)

            def dockerImage = docker.build(
              "ductuanbl2000/fe-architecture-app:${commitHash}",
              "./"
            )

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
      echo 'Build and push Docker image SUCCESS'
    }

    failure {
      echo 'Build FAILED'
    }

  }
}
