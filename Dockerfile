# Use the official eclipse-mosquitto image from the Docker Hub
FROM eclipse-mosquitto:latest

# Copy the configuration file
COPY mosquitto.conf /mosquitto/config/mosquitto.conf

# Expose the default MQTT port
EXPOSE 1883