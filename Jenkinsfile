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

                        export USE_GKE_GCLOUD_AUTH_PLUGIN=True
                        gcloud auth activate-service-account --key-file=$KEY_FILE
                        gcloud config set project ${PROJECT_ID}
                        gcloud container clusters get-credentials ${CLUSTER} --zone ${ZONE}

                        kubectl apply -f safe-app-full.yaml
                        kubectl apply -f gateway.yaml
                        kubectl apply -f httproute.yaml

                        kubectl set image deployment/safe-backend \
                          backend=pritammehta/safe-backend:${IMAGE_TAG}

                        kubectl set image deployment/safe-frontend \
                          frontend=pritammehta/safe-frontend:${IMAGE_TAG}

                        kubectl rollout status deployment/safe-backend --timeout=120s
                        kubectl rollout status deployment/safe-frontend --timeout=120s
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
