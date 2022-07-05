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

RUN --mount=type=secret,id=DB_HOST \
  --mount=type=secret,id=DB_USER \
   export DB_HOST=$(cat /run/secrets/DB_HOST) && \
   export DB_USER=$(cat /run/secrets/DB_USER) && \

ENV DB_HOST=${DB_HOST}
ENV DB_PORT=5432
ENV DB_USER=${DB_USER}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV DB_DATABASE=${DB_DATABASE}
ENV SECRET_KEY=${SECRET_KEY}

EXPOSE 3000

RUN npm run build


########### prod ################

FROM node:16-alpine as production

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY --from=build /app/dist ./dist

EXPOSE 3000


# Define the command to run my app using CMD which defines your runtime
CMD ["npm", "run", "start:prod"]


