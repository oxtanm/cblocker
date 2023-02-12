kubectl create configmap config-repo-reporter-server --from-file=config-repo/reporter-server.yml --save-config

kubectl create secret generic mysql-credentials \
    --from-literal=SPRING_DATASOURCE_USERNAME=mysqlprod \
    --from-literal=SPRING_DATASOURCE_PASSWORD=InsertPwdHere \
    --save-config
