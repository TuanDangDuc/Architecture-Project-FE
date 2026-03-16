pipeline {
  agent any
  
  stages {
    stage('Checkout') {
      steps {
        git(branch: 'main', url: 'https://github.com/TuanDangDuc/Architecture-Project-FE.git')
      }
    }

    stage('Publish image') {
      steps {
        script {
          docker.withRegistry('https://index.docker.io/v1/', 'dockerlogin') {
            def commitHash = env.GIT_COMMIT.take(7)
            def dockerImage = docker.build("ductuanbl2000/sysfoo:${commitHash}", "./")
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
