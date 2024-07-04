FROM node:18 as builder

WORKDIR /app
COPY package.json ./
RUN npm install --legacy-peer-deps
COPY . ./

# Define env and args
ARG PATATO
ENV PATATO=$PATATO

RUN npm run build
RUN npm run lint

ENTRYPOINT [ "npm", "run", "start"]
