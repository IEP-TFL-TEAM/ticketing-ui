pipeline {
    agent any

    stages {
        stage('Clone Repository') {
          withCredentials([usernamePassword(credentialsId: 'github-repo', usernameVariable: 'BRANCH', passwordVariable: 'REPO_URL')]) {
            steps {
                git branch: "$BRANCH", url: "$REPO_URL"
            }
          }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Test') {
            steps {
                sh 'npm run test:unit'
            }
        }

        stage('Docker Build & Push') {
           steps {
                script {
                    docker.withRegistry('', '30') {
                        def image = docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                        image.push()
                    }
                }
            }
        }

        stage('Deploy to Web Server') {
            steps {
                sshagent(credentials: [SSH_CREDENTIALS_ID_]) {
                    sh """
                    ssh ${SSH_USER}@${DEPLOY_SERVER} << EOF
                    docker pull ${DOCKER_IMAGE}:${DOCKER_TAG}
                    docker stop ticketing-ui || true
                    docker rm ticketing-ui || true
                    docker run -d --name ticketing-ui -p 80:80 ${DOCKER_IMAGE}:${DOCKER_TAG}
                    EOF
                    """
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}
