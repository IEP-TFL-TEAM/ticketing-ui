pipeline {
    agent any

    stages {
        stage('Goto Web Server') {
            steps {
                sshagent(['jenkins-ssh-key']) {
                    sh '''
                      ssh maanvik@192.168.20.2 << 'EOF'
                      cd /var/www/sveltekit/ticketing-ui/
                      ls -la
                      git pull
                      pm2 stop "ticketing-ui"
                      pm2 del "ticketing-ui"
                      sudo npm run build
                      pm2 start node --name "ticketing-ui" -- build
                      pm2 save
                      pm2 status
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
