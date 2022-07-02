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

RUN npm run build


########### prod ################

FROM node:16-alpine as production

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY --from=build /app/dist ./dist


ENV DB_HOST=buckit-test.cu2tuicjcenu.ap-northeast-2.rds.amazonaws.com
ENV DB_PORT=5432
ENV DB_USER=postgres
ENV DB_PASSWORD=buckit8080
ENV DB_DATABASE=buckit
ENV SECRET_KEY=941D897597EA5

EXPOSE 3000


# Define the command to run my app using CMD which defines your runtime
CMD ["npm", "run", "start:prod"]


