.PHONY: build run dev stop clean

build:
	docker build -t oxtron-app .

run:
	docker run -p 3000:3000 \
		-e AUTH_SECRET=$$(openssl rand -base64 32) \
		-e AUTH_URL=http://localhost:3000 \
		oxtron-app

dev:
	npm run dev

stop:
	docker stop $$(docker ps -q --filter ancestor=oxtron-app) || true

clean:
	docker rmi oxtron-app || true
	docker system prune -f

deploy:
	PROJECT_ID=second-broker-453715-e5
	REGION=us-central1
	REPO=oxtron-frontend-repo
	SERVICE_NAME=oxtron-frontend
	IMAGE=$${REGION}-docker.pkg.dev/$${PROJECT_ID}/$${REPO}/$${SERVICE_NAME}:latest
	docker buildx build --platform linux/amd64 -t $${IMAGE} --push .
	gcloud run deploy $${SERVICE_NAME} \
	  --image $${IMAGE} \
	  --region $${REGION} \
	  --platform managed \
	  --allow-unauthenticated \
	  --port 3000

build-run: build run