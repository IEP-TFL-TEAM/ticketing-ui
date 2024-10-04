pipeline {
    agent any

    environment {
        DOCKER_USER = 'josedleavai'
        DOCKER_IMAGE = 'ticketing-ui'
        DOCKER_TAG = 'latest'
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: "main", url: "https://github.com/IEP-TFL-TEAM/ticketing-ui.git"
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Test') {
            steps {
                sh 'npm run test:unit'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy to Web Server') {
            steps {
                sshagent(['jenkins-ssh-key']) {
                    sh '''
                      ssh -t -o StrictHostKeyChecking=no maanvik@192.168.20.2
                      scp -r /var/lib/jenkins/workspace/Ticketing-UI/build/* maanvik@192.168.20.2:/var/app/ticketing/ui/
                    '''
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
