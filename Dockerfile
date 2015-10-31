FROM sihrc/indikitty

ADD . /kittyface
WORKDIR /kittyface

RUN cp -r /kittydar /kittyface/kittydar && \
    npm install --no-bin-links && \
    cd indikitty && \
    python setup.py develop

CMD ["/kittyface/bin/forever.sh"]
