#!/bin/sh
# rsync -rz public/ sdmo:/var/www/prestaweb/transfer/

#sudo rsync -e "sudo -u mob ssh" -a -r -z public/ smdo:/var/www/prestaweb/transfer/
rsync -r -z -a -e "ssh" --rsync-path="sudo rsync" public/ sdmo:/var/www/prestaweb/transfer/
