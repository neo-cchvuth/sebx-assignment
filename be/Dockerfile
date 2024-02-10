# Two-Stage build for smaller image size
# use bullseye-slim variant for less vulnerability but larger image size
FROM node:20-alpine as build
WORKDIR /usr/src/backend
COPY . .
RUN npm pkg delete "scripts.prepare"
RUN npm i --silent
RUN npm run build

FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /usr/backend
COPY --from=build /usr/src/backend/package*.json .
# now installs only prod packages
RUN npm i --silent
COPY --from=build /usr/src/backend/dist .
EXPOSE 3001
ENV PORT 3001
CMD [ "node", "main.js" ]