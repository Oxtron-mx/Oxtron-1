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

build-run: build run