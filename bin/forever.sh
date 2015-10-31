#!/bin/bash
python -m indikitty.listen &
forever start /kittyface/app.js
forever logs 0 -f
