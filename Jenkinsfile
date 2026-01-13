pipeline {
    agent any

    environment {
        PROJECT_ID = 'pritam-483911'
        CLUSTER    = 'safe-credential-standard'
        ZONE       = 'us-central1-a'

        GKE_CRED_ID = 'gke-service-key'
        HUB_CRED_ID = 'dockerhub-jenkins'
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'dev',
                    url: 'https://github.com/pritammehta01/Safe-Credential.git'
            }
        }

        stage('Build & Push Images') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: "${HUB_CRED_ID}",
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    sh '''
                        set -e
                        IMAGE_TAG=${BUILD_NUMBER}

                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

                        echo "🔨 Building backend:${IMAGE_TAG}"
                        docker build -t $DOCKER_USER/safe-backend:${IMAGE_TAG} ./backend
                        docker push $DOCKER_USER/safe-backend:${IMAGE_TAG}

                        echo "🔨 Building frontend:${IMAGE_TAG}"
                        docker build -t $DOCKER_USER/safe-frontend:${IMAGE_TAG} .
                        docker push $DOCKER_USER/safe-frontend:${IMAGE_TAG}
                    '''
                }
            }
        }

        stage('Deploy to GKE') {
            steps {
                withCredentials([
                    file(credentialsId: "${GKE_CRED_ID}", variable: 'KEY_FILE')
                ]) {
                    sh '''
    set -e
    IMAGE_TAG=${BUILD_NUMBER}

    # 1. Update your cluster credentials (Auth)
    gcloud container clusters get-credentials ${CLUSTER} --zone ${ZONE}

    # 2. Apply the YAML (WITHOUT DELETING FIRST)
    # This ensures your Service IPs and MongoDB remain stable.
    kubectl apply -f safe-app-full.yaml

    # 3. Update only the application images
    kubectl set image deployment/safe-backend \
      backend=pritammehta/safe-backend:${IMAGE_TAG}
    
    kubectl set image deployment/safe-frontend \
      frontend=pritammehta/safe-frontend:${IMAGE_TAG}

    # 4. Give GKE more time to verify health (300 seconds)
    kubectl rollout status deployment/safe-backend --timeout=300s
'''
                }
            }
        }
    }

    post {
        always {
            sh 'docker image prune -f || true'
        }
        failure {
            echo "❌ Deployment failed. Use kubectl rollout undo if needed."
        }
    }
}
