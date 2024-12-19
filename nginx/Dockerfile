FROM nginx:latest

# Set arguments for substitution
ARG WEB_DOMAIN
ARG API_DOMAIN
ENV WEB_DOMAIN=WEB_DOMAIN
ENV API_DOMAIN=API_DOMAIN

#-----------------------------------#
COPY ./nginx/conf.d/default.conf.template /etc/nginx/conf.d/default.conf
#-----------------------------------#

# Replace placeholders in the template
RUN sed -i 's/\${WEB_DOMAIN}/'"$WEB_DOMAIN"'/g' /etc/nginx/conf.d/default.conf
RUN sed -i 's/\${API_DOMAIN}/'"$API_DOMAIN"'/g' /etc/nginx/conf.d/default.conf

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]