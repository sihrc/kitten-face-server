FROM sihrc/kittydar

ADD . /kittyface
WORKDIR /kittyface

RUN cp -r /kittydar /kittyface/kittydar && \
    npm install --no-bin-links

CMD ["/kittyface/bin/forever.sh"]
