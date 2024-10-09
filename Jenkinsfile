pipeline {
    agent any

    stages {
        stage('Goto Web Server') {
            steps {
                sshagent(['jenkins-ssh-key']) {
                    sh '''
                      ssh -t -o StrictHostKeyChecking=no maanvik@192.168.20.2
                      cd /var/www/sveltekit/ticketing-ui/
                      ls -la
                      git pull
                      npm run build
                      pm2 start node --name "ticketing-ui" -- build
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
