FROM ruby:3.3

# System deps needed for Rails + PostgreSQL
RUN apt-get update -qq \
    && apt-get install -y --no-install-recommends build-essential libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Bundler config (gems will be cached to the mounted volume in compose)
ENV BUNDLE_PATH=/usr/local/bundle
ENV BUNDLE_JOBS=4
ENV BUNDLE_RETRY=3

# Copy the app (if not generated yet, this is a no-op until you generate it)
COPY . .

# Install gems if a Gemfile exists (safe to run before app is generated)
RUN if [ -f Gemfile ]; then bundle install; fi

EXPOSE 3000

CMD ["bash", "-lc", "bundle exec rails server -b 0.0.0.0 -p 3000"]

