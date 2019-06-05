#!/bin/bash

mvn verify &&
appcfg.sh --service_account_json_key_file=client-secret.json --version=$VERSION update target/codeu-starter-project-0.0.1-SNAPSHOT &&
appcfg.sh --service_account_json_key_file=client-secret.json --version=$VERSION set_default_version target/codeu-starter-project-0.0.1-SNAPSHOT
