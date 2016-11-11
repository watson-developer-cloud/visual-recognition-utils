#!/bin/bash
#
# Copyright 2016 IBM Corp. All Rights Reserved.
# 
# Licensed under the Apache License, Version 2.0 (the “License”);
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
# 
#  https://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an “AS IS” BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
 
# Color vars to be used in shell script output
RED='\033[0;31m'
YELLOW='\033[0;33m'
LIGHT_YELLOW='\033[0;93m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

BOLD='\033[0;1m'
RESET='\033[0;0m'

# load configuration variables
source local.env


function usage() {
  echo -e "${YELLOW}Usage: $0 [--list, --delete, --create]${NC}\n"
}



# list all custom classifiers
function list() {
    echo -e "${YELLOW}Fetching list of Visual Recognition Custom Classifiers${NC}"
    CLASSIFIERS=`curl -s -X GET -H "Accept-Language: en" "https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classifiers?&api_key=${WATSON_VISION_KEY}&version=2016-05-20"`
    echo -e "${CYAN}$CLASSIFIERS${NC}\n"
}


# delete custom classifier
function delete() {

    read -p "Please enter the classifier id that you would like to delete: " classifier_id
    length=${#classifier_id}

    if (( length > 0 )) 
    then

        echo -e "This will remove classifier: '${BOLD}${RED}${classifier_id}${NC}${RESET}'.  "
        
        while true; do

            read -e -p "Are you sure? [yn]: " yn
            case $yn in
                [Yy]* ) 
                    echo -e "${YELLOW}Deleting '${classifier_id}'${NC}"
                    DELETION=`curl -s -X DELETE "https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classifiers/${classifier_id}?api_key=${WATSON_VISION_KEY}&version=${WATSON_VISION_VERSION}"`
                    echo -e "${CYAN}$DELETION${NC}\n"
                    break;;
                [Nn]* )
                    echo -e "\n" 
                    exit;;
                * ) echo "Please answer Yes or No.";;
            esac
        done
        
    else
        echo -e "${LIGHT_YELLOW}No classifier id was specified.${NC}\n"
    fi
}



# create a new custom classifier
function create() {
    read -p "Please enter the name for the classifier: " classifier_name
    length=${#classifier_name}

    if (( length > 0 )) 
    then

        echo -e "Creating a classifier with the name: '${BOLD}${GREEN}${classifier_name}${NC}${RESET}'.  "
        
        while true; do

            read -e -p "Are you sure? [yn]: " yn
            case $yn in
                [Yy]* )
                    # echo -e "Positive zip file path: '${BOLD}${RED}${classifier_id}${NC}${RESET}'.  "
                    
                    while true; do
                        read -e -p "Positive zip file path: " positive_path
                        p_length=${#positive_path}

                        if (( p_length > 0 )); then
                            break;
                        else 
                            echo -e "${RED}Please specify path for positive training data.${NC}"
                        fi 
                    done
                    
                    while true; do
                        read -e -p "Negative zip file path (blank for none): " negative_path
                        n_length=${#negative_path}

                        if (( p_length > 0 )); then
                            break;
                        else
                            echo -e "${RED}Please specify path for negative training data.${NC}"
                        fi 
                    done


                    echo -e "${YELLOW}Training Custom Classifier... ${NC}"
                    TRAINING=`curl -X POST -F "${classifier_name}_positive_examples=@${positive_path}" -F "negative_examples=@${negative_path}" -F "name=${classifier_name}" "https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classifiers?api_key=${WATSON_VISION_KEY}&version=${WATSON_VISION_VERSION}"`
                    echo -e "${CYAN}$TRAINING${NC}\n"


                    break;;
                [Nn]* ) exit;;
                * ) echo "Please answer Yes or No.";;
            esac
        done
        
    else
        echo -e "${LIGHT_YELLOW}No classifier name was specified.${NC}\n"
    fi
}





case "$1" in
"--list" )
list
;;
"--delete" )
delete
;;
"--create" )
create
;;
* )
usage
;;
esac



