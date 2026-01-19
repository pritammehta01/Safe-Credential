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

                        docker build -t $DOCKER_USER/safe-backend:${IMAGE_TAG} ./backend
                        docker push $DOCKER_USER/safe-backend:${IMAGE_TAG}

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
                        export IMAGE_TAG=${BUILD_NUMBER}

                        gcloud auth activate-service-account --key-file=$KEY_FILE
                        gcloud container clusters get-credentials ${CLUSTER} --zone ${ZONE}

                        envsubst < safe-app-full.yaml | kubectl apply -f -

                       # Gateway & HTTPRoute are infra (applied separately)
                       # kubectl apply -f gateway.yaml
                       # kubectl apply -f httproute.yaml

                        kubectl rollout status deployment/safe-backend --timeout=600s
                        kubectl rollout status deployment/safe-frontend --timeout=600s
                    '''
                }
            }
        }
      /*
        stage('Install Prometheus & Grafana') {
            steps {
                withCredentials([
                    file(credentialsId: "${GKE_CRED_ID}", variable: 'KEY_FILE')
                ]) {
                    sh '''
                        set -e

                        gcloud auth activate-service-account --key-file=$KEY_FILE
                        gcloud container clusters get-credentials ${CLUSTER} --zone ${ZONE}

                        # Install Helm if missing
                        if ! command -v helm >/dev/null; then
                          curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
                        fi

                        helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
                        helm repo update

                        kubectl create namespace monitoring --dry-run=client -o yaml | kubectl apply -f -

                        helm upgrade --install monitoring prometheus-community/kube-prometheus-stack \
                          --namespace monitoring \
                          --wait
                    '''
                }
            }
        }
        */
    }

    post {
        always {
            sh 'docker image prune -f || true'
        }
        failure {
            echo "❌ Deployment failed. Run kubectl describe pod for details."
        }
    }
}
