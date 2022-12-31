# home-automation-project


## Description

This project is about home automation

There are two components: **User** and **Blood Pressure Record**

User:
- authenicate with JWT
- register with a secret code
- login
- logout

Blood Pressure Record:
- create the record
- read the record in a table format
- update the record
- delete the record
- *prefill the record with image*

For the prefilling process:

![Alt text](docs/image_processing_pipeline.png?raw=true "Image processing Pipeline")

This method may not be accurate under strong difference in terms of light condition


## How to setup

### Backend

```bash
# move to the backend folder
cd backend

# install python dependencies
pip install -r requirements.txt

# perform the django data migration
python manage.py migrate

# create a django super admin
python manage.py createsuperuser --email admin@example.com --username root

# start the server
python manage.py runserver
```

## Frontend

```bash
# move to the frontend folder
cd frontend

# install dependencies
yarn

# start frontend
yarn run dev
```

*This require two terminal to run the stack*