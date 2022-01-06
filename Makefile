BUILDTIME=$(shell date +"%s")


deploy:
	# BUILD HERE
	rm -rf node_modules
	npm install
	npm run build
	npm prune --production
	docker build -t amirmfallah/mobydick-app-frontend:api.0.0.${BUILDTIME} .
	docker push amirmfallah/mobydick-app-frontend:api.0.0.${BUILDTIME}
	~/arvan paas set image deployment/mobydick-api-beta mobydick-api-beta=amirmfallah/mobydick-app-frontend:api.0.0.${BUILDTIME}