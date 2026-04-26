FROM nginx:alpine

# Copy static assets
COPY . /usr/share/nginx/html

# Default nginx config for Cloud Run
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
