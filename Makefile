BUILDTIME=$(shell date +"%s")

install:
	rm -rf node_modules
	npm ci
	npm run build
	npm prune --production

build:
	rm -rf ./node_modules/bcrypt
	docker build -t amirmfallah/mobydick-app-frontend:api.0.0.${BUILDTIME} .
	docker push amirmfallah/mobydick-app-frontend:api.0.0.${BUILDTIME}
	~/arvan paas set image deployment/mobydick-api-beta mobydick-api-beta=amirmfallah/mobydick-app-frontend:api.0.0.${BUILDTIME}

deploy:
	# BUILD HERE
	rm -rf node_modules
	npm ci
	npm run build
	npm prune --production
	docker build -t amirmfallah/mobydick-app-frontend:api.0.0.${BUILDTIME} .
	docker push amirmfallah/mobydick-app-frontend:api.0.0.${BUILDTIME}
	~/arvan paas set image deployment/mobydick-api-beta mobydick-api-beta=amirmfallah/mobydick-app-frontend:api.0.0.${BUILDTIME}