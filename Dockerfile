FROM node:18

WORKDIR /app

COPY package.json package-lock.json /app/
COPY .env .env

RUN npm install && \
    rm -rf /tmp/* /var/tmp/*

RUN chown -R node:node /app/*

COPY . /app

RUN npm run build

EXPOSE 3000

# USER node

ENV TYPEORM_MIGRATION=ENABLE

ENV NPM_INSTALL=ENABLE

COPY --chown=node:node ./start.sh /app/start.sh
RUN chmod +x /app/start.sh

# CMD npm run start:debug
CMD ["./start.sh"]