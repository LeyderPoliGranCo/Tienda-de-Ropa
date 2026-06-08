pipeline {
    agent any

    stages {
        stage('Validate Docker Compose') {
            steps {
                sh 'docker compose config'
            }
        }

        stage('Stop Previous Containers') {
            steps {
                sh 'docker compose down || true'
            }
        }

        stage('Build Images') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Start Services') {
            steps {
                sh 'docker compose up -d db backend frontend'
            }
        }

        stage('Smoke Test Backend') {
            steps {
                sh '''
                    echo "Esperando backend..."
                    sleep 15
                    docker compose ps
                    docker compose exec -T backend python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/docs')"
                '''
            }
        }

        stage('Smoke Test Frontend') {
            steps {
                sh '''
                    docker compose exec -T frontend wget -q --spider http://localhost/
                '''
            }
        }
    }

    post {
        always {
            sh 'docker compose ps || true'
        }
    }
}