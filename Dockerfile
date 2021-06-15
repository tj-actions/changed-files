FROM alpine:3.14.0

LABEL maintainer="Tonye Jack <jtonye@ymail.com>"

RUN apk add bash git openssh grep sed

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
