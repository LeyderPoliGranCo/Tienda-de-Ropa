pipeline {
    agent any

    environment {
        POSTGRES_DB = 'tienda_ropa'
        POSTGRES_USER = 'usr_tienda_ropa'
        POSTGRES_PASSWORD = 'pwsrd_tiendaRopa2026*'
        DATABASE_URL = 'postgresql://tienda_user:tienda_pass@db:5432/tienda_ropa'
    }

    stages {
        stage('Validate Docker Compose') {
            steps {
                sh 'docker compose config'
            }
        }

        stage('Stop Previous App Containers') {
            steps {
                sh '''
                    docker rm -f tienda_db tienda_backend tienda_frontend || true
                    docker compose down --remove-orphans || true
                '''
            }
        }

        stage('Build Images') {
            steps {
                sh 'docker compose build backend frontend'
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
                    sleep 20
                    docker compose ps
                    docker compose logs backend || true
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