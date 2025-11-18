.PHONY: run dev stop clean

run:
	@docker build -t oxtron-app . && \
	docker run --rm -p 3000:3000 \
		-e AUTH_SECRET=$$(openssl rand -base64 32) \
		-e AUTH_URL=http://localhost:3000 \
		-e NEXT_PUBLIC_API_BASE_URL=$${NEXT_PUBLIC_API_BASE_URL:-http://localhost:8000} \
		-e NEXT_PUBLIC_X_API_KEY=$${NEXT_PUBLIC_X_API_KEY:-} \
		oxtron-app

dev:
	npm run dev

stop:
	@docker stop $$(docker ps -q --filter ancestor=oxtron-app) 2>/dev/null || true

clean:
	@docker rmi oxtron-app 2>/dev/null || true