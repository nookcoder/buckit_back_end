FROM node:16-alpine as build

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3000

ARG DB_HOST
ARG DB_PORT
ARG DB_USER
ARG DB_PASSWORD
ARG DB_DATABASE
ARG SECRET_KEY

ENV DB_HOST=$DB_HOST
ENV DB_PORT=$DB_PORT
ENV DB_USER=$DB_USER
ENV DB_PASSWORD=$DB_PASSWORD
ENV DB_DATABASE=$DB_DATABASE
ENV SECRET_KEY=$SECRET_KEY

RUN npm run build

########### prod ################

FROM node:16-alpine as production

WORKDIR /app

COPY package*.json ./

ARG DB_HOST
ARG DB_PORT
ARG DB_USER
ARG DB_PASSWORD
ARG DB_DATABASE
ARG SECRET_KEY

RUN echo $DB_HOST

ENV DB_HOST=$DB_HOST
ENV DB_PORT=$DB_PORT
ENV DB_USER=$DB_USER
ENV DB_PASSWORD=$DB_PASSWORD
ENV DB_DATABASE=$DB_DATABASE
ENV SECRET_KEY=$SECRET_KEY

RUN npm install --only=production

COPY --from=build /app/dist ./dist

EXPOSE 3000


# Define the command to run my app using CMD which defines your runtime
CMD ["npm", "run", "start:prod"]


