### Install Firebase CLI ###

Follow the instructions in the Setup section here:
https://firebase.google.com/docs/cli/

### Create project ###

Go here and create a new project:
https://console.firebase.google.com/

Copy the project id. You will use it in the next step.

### Deploy your function ###

Go in to functions and run:

npm install
firebase deploy --only functions --project <your-project-id>

### Setup database ###

Before testing the API you need to activate the firestore database. 
1. Go to https://console.firebase.google.com/
2. Open your project
3. Navigate to Develop -> Database
4. Choose Cloud Firestore Beta
5. Choose "Start in test mode"
6. Press "+Add collection"
7. Choose the name "lists"
8. Create a document with auto id and a field called "name" and choose a name for your list


### Test the API ###

1. Copy the URL next to "Function URL" printed in your console after the firebase deploy command.
2. Paste it in you browser and add "/api/1/lists".
3. Make sure your list created in last part is returned

Your API is now ready to be used