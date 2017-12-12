var config = {
    apiKey: "AIzaSyDdqG89B02FSAO_r0H-MW2xZ4VFXJE4MHA",
    authDomain: "train-times-activity.firebaseapp.com",
    databaseURL: "https://train-times-activity.firebaseio.com",
    projectId: "train-times-activity",
    storageBucket: "",
    messagingSenderId: "84980336688"
};
firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding Trains
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();   
    var trainStart = $("#start-input").val().trim();
    var trainFrequency = $("#frequency-input").val().trim();

    // Creates local "temporary" object for holding train data
    var newTrain = {
        name: trainName,
        destination: trainDestination,
        start: trainStart,
        frequency: trainFrequency
    };

    // Uploads train data to the database
    database.ref().push(newTrain);

    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.start);
    console.log(newTrain.frequency);

    // Alert
    alert("Train successfully added");

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#start-input").val("");
    $("#frequency-input").val("");
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot, prevChildKey) {

    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainStart = childSnapshot.val().start;
    var trainFrequency = childSnapshot.val().frequency;

    // Train Info
    console.log(trainName);
    console.log(trainDestination);
    console.log(trainStart);
    console.log(trainFrequency);

    // converts trainTime to moment stamp
    var trainStartConverted = moment(trainStart, "hh:mm");
    
    var minutesAway = moment().diff(moment(trainStartConverted), "minutes") % trainFrequency; 

    // If minutesAway is getting the minutes away from the previous train, switch to minutes from next train
    if(minutesAway > 0) {
        minutesAway = trainFrequency - minutesAway;
    } else {
        minutesAway = Math.abs(minutesAway);
    }

    var nextArrival = moment().add(minutesAway, 'minutes').format("LT");

    // Add each train's data into the table
    $("#trains-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" +
        trainFrequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");
});
