pipeline{
    agent any
    environment{
        SONAR_HOME= tool "sonar"
    }
    stages{
        stage("Code clone from git hub"){
            steps{
                git url: "https://github.com/pritammehta01/Safe-Credential.git", branch: "dev"
            }
        }
        stage("SonarQube Quality analysis"){
            steps{
              withSonarQubeEnv("sonar"){
                  sh "$SONAR_HOME/bin/sonar-scanner -Dsonar.projectName=Safe-Credential -Dsonar.projectKey=Safe-Credential"
              }
            }
        }
        stage("OWASP Dependency Check"){
            steps{
                dependencyCheck additionalArguments: '--scan ./', odcInstallation: 'dc'
                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
                
            }
        }
        
        stage("Trivy File System Scan"){
            steps{
                sh "trivy fs --format table -o trivy-fs-report.html ."
            }
        }
        stage("Deploy Using Docker-Compose"){
            steps{
                sh "docker-compose up -d"
            }
        }
        // stage("Deploy Using Docker-Compose"){
        //     steps{
        //         sh "docker-compose down --rmi all --volumes"
        //     }
        // }
        // stage("Deploy Using Docker-Compose"){
        //     steps{
        //         sh "docker-compose down"
        //     }
        // }
        
    }
}
