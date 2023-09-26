
###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine
# Set the working directory in the container
WORKDIR /app
# Copy package.json and package-lock.json to the container

# Copy the rest of the application source code to the container
COPY . .

# Change .env file for test.
RUN mv .env.test .env

RUN  npm i -g @nestjs/cli

RUN npm run build

# Expose the port your Nest.js application will listen on (default is 3000)
EXPOSE 3000

CMD [ "node", "dist/main.js" ]
