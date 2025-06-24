FROM node:20

# Install Wasp
RUN curl -sSL https://get.wasp-lang.dev/installer.sh | bash

# Add Wasp to PATH
ENV PATH="/root/.wasp/bin:$PATH"

# Set working directory
WORKDIR /app

# Copy all files
COPY . .

# Install node/prisma deps
RUN npm install
RUN wasp build

# Expose port
EXPOSE 3000

# Start app
CMD ["wasp", "start"]
