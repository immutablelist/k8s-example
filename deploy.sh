#!/usr/bin/env bash

# BUILD ----
docker build -t tanguven/multi_client:latest -t tanguven/multi_client:$SHA -f ./client/Dockerfile ./client
docker build -t tanguven/multi_server:latest -t tanguven/multi_server:$SHA -f ./server/Dockerfile ./server
docker build -t tanguven/multi_worker:latest -t tanguven/multi_worker:$SHA -f ./worker/Dockerfile ./worker

# PUSH -----
docker push tanguven/multi_client:latest
docker push tanguven/multi_server:latest
docker push tanguven/multi_worker:latest

docker push tanguven/multi_client:$SHA
docker push tanguven/multi_server:$SHA
docker push tanguven/multi_worker:$SHA

# RUN KUBERNETES DEPLOYMENT ----
kubectl apply -f k8s
kubectl set image deployments/client-deployment client=tanguven/multi_client:$SHA
kubectl set image deployments/server-deployment server=tanguven/multi_server:$SHA
kubectl set image deployments/worker-deployment worker=tanguven/multi_worker:$SHA
