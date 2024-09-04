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
                sshagent(['webserver']) {
                    sh '''
                    scp -o StrictHostKeyChecking=no -r .svelte-kit/output/* maanvik@192.168.20.2:/home/maanvik/app/ticketing/ui/
                    ssh -o StrictHostKeyChecking=no maanvik@192.168.20.2 "sudo systemctl restart nginx"
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
