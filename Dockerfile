# Docker Multistage construction 

### DEV Environmental Science  ###
FROM node:13-alpine AS development

ARG NODE_ENV=development

ENV PORT=5000 \
    MONGODB_URI=mongodb://root:pass12345@mongodb \
    JWT_SECRET=hk4f1h7al8hd.fjh019fdl34kh3234dhf3h1ds22
 

#  Navigate to the container working directory 
WORKDIR /usr/src/app
# #  Copy package.json
COPY package*.json ./

RUN npm install glob rimraf
RUN npm install --only=development

COPY . .

RUN npm run build

# # ### PROD Environmental Science  ###
FROM node:13-alpine as production

ARG NODE_ENV=production
ENV PORT=5000 \
    MONGODB_URI=mongodb://host.docker.internal:27017/jamming \
    JWT_SECRET=hk4f1h7al8hd.fjh019fdl34kh3234dhf3h1ds22
 
WORKDIR /usr/src/app

COPY package*.json ./

RUN \
  npm config set registry https://registry.npm.taobao.org \
  && npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/src/main"]