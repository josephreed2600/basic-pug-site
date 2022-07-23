FROM node
#ENV NODE_ENV=production
WORKDIR /srv
COPY package.json .
RUN npm install --production
COPY . .
CMD node .

EXPOSE 8080
VOLUME /srv/public
VOLUME /srv/files
VOLUME /srv/views
