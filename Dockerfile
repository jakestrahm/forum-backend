FROM node:alpine

# create app directory
WORKDIR /app

# install dependencies 
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./

RUN npm install

# bundle app source code 
# COPY . ./forum-backend

# map to correct port
EXPOSE 6006

# define command for running
CMD ["npm", "run", "dev"]
