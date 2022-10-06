#!/bin/bash
set -euxo pipefail

curl -OL https://go.dev/dl/go1.19.2.linux-amd64.tar.gz
rm -rf /usr/local/go && tar -C /usr/local -xzf go1.19.2.linux-amd64.tar.gz
sudo sh -c "echo 'export PATH=\$PATH:/usr/local/go/bin' >> /etc/profile"
go version