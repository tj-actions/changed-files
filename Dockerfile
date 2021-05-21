FROM alpine:3.13.5

LABEL maintainer="Tonye Jack <jtonye@ymail.com>"

RUN apk add bash git openssh grep sed

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
