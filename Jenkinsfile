pipeline {
    agent any
    environment {
        // Project configuration
        DOCKER_USER = 'pritammehta'
        PROJECT_ID  = 'pritam-483911'
        CLUSTER     = 'safe-credential-standard'
        ZONE        = 'us-central1-a'
        
        // Match these to your Jenkins credential screen
        GKE_CRED_ID = 'gke-service-key'
        HUB_CRED_ID = 'dockerhub-jenkins'
    }
    stages {
        stage('Checkout Code') {
            steps {
                // This pulls your yaml files from your GitHub repo
                git branch: 'dev', url: 'https://github.com/pritammehta01/Safe-Credential.git'
            }
        }
        stage('Build & Push to DockerHub') {
            steps {
                script {
                    docker.withRegistry('', "${HUB_CRED_ID}") {
                        // Backend: Built from /backend and tagged latest
                        def backendImg = docker.build("${DOCKER_USER}/safe-backend:latest", "./backend")
                        backendImg.push()

                        // Frontend: Built from root and tagged latest
                        def frontendImg = docker.build("${DOCKER_USER}/safe-frontend:latest", ".")
                        frontendImg.push()
                    }
                }
            }
        }

        stage('Deploy to GKE') {
            steps {
                withCredentials([file(credentialsId: "${GKE_CRED_ID}", variable: 'KEY_FILE')]) {
                    sh """
                        gcloud auth activate-service-account --key-file=\$KEY_FILE
                        gcloud container clusters get-credentials ${CLUSTER} --zone ${ZONE} --project ${PROJECT_ID}
                        
                        kubectl apply -f safe-app-full.yaml
                        kubectl apply -f gateway.yaml
                        kubectl apply -f httproute.yaml
                    """
                }
            }
        }
    }
    
    post {
        always {
            script {
                // Delete images from Jenkins VM after pushing to save space
                sh "docker rmi ${DOCKER_USER}/safe-backend:latest || true"
                sh "docker rmi ${DOCKER_USER}/safe-frontend:latest || true"
                sh "docker image prune -f"
            }
        }
    }
}
