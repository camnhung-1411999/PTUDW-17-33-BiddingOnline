var firebaseConfig = {
    apiKey: "AIzaSyD3X4SJRK8dJLBAFyQfx554VNVAeu1UV-U",
    authDomain: "web-storage-78cfc.firebaseapp.com",
    databaseURL: "https://web-storage-78cfc.firebaseio.com",
    projectId: "web-storage-78cfc",
    storageBucket: "web-storage-78cfc.appspot.com",
    messagingSenderId: "1069477785008",
    appId: "1:1069477785008:web:1452293a1ce6009a373a75",
    measurementId: "G-PFH49WHB3G"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

var selectedFile;

function getfile() {
    var pic = document.getElementById("photo");

    // selected file is that file which user chosen by html form 
    selectedFile = pic.files[0];

    // make save button disabled for few seconds that has id='submit_link' 
    document.getElementById('submit_link').setAttribute('disabled', 'true');
    myfunction(); // call below written function 
}

function myfunction() {
    // select unique name for everytime when image uploaded 
    // Date.now() is function that give current timestamp 
    var name = Date.now();

    // make ref to your firebase storage and select images folder 
    var storageRef = firebase.storage().ref('/images/' + name);

    // put file to firebase  
    var uploadTask = storageRef.put(selectedFile);

    // all working for progress bar that in html 
    // to indicate image uploading... report 
    uploadTask.on('state_changed', function (snapshot) {
        // var progress =
        //     (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // var uploader = document.getElementById('process');
        // uploader.value = progress;
        switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED:
                console.log('Upload is paused');
                break;
            case firebase.storage.TaskState.RUNNING:
                console.log('Upload is running');
                break;
        }
    }, function (error) {
        console.log(error);
    }, function () {

        // get the uploaded image url back 
        uploadTask.snapshot.ref.getDownloadURL().then(
            function (downloadURL) {

                // You get your url from here 
                //console.log('File available at', downloadURL);
                document.getElementById('url').value = downloadURL;
                $('#image').attr("src", downloadURL);

                // alert(document.getElementById('url').value);
                // print the image url  
                console.log(downloadURL);
                document.getElementById('submit_link').removeAttribute('disabled');
            });
    });
};


function getfile1() {
    var pic = document.getElementById("photo1");

    // selected file is that file which user chosen by html form 
    selectedFile = pic.files[0];

    // make save button disabled for few seconds that has id='submit_link' 
    document.getElementById('submit_link').setAttribute('disabled', 'true');
    myfunction1(); // call below written function 
}

function myfunction1() {

    var name = Date.now();

    var storageRef = firebase.storage().ref('/images/' + name);

    var uploadTask = storageRef.put(selectedFile);

    uploadTask.on('state_changed', function (snapshot) {
        // var progress =
        //     (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // var uploader = document.getElementById('process');
        // uploader.value = progress;
        switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED:
                console.log('Upload is paused');
                break;
            case firebase.storage.TaskState.RUNNING:
                console.log('Upload is running');
                break;
        }
    }, function (error) {
        console.log(error);
    }, function () {

        // get the uploaded image url back 
        uploadTask.snapshot.ref.getDownloadURL().then(
            function (downloadURL) {

                document.getElementById('url1').value = downloadURL;
                $('#image1').attr("src", downloadURL);

                console.log(downloadURL);
                document.getElementById('submit_link').removeAttribute('disabled');
            });
    });
};



function getfile2() {
    var pic = document.getElementById("photo2");

    // selected file is that file which user chosen by html form 
    selectedFile = pic.files[0];

    // make save button disabled for few seconds that has id='submit_link' 
    document.getElementById('submit_link').setAttribute('disabled', 'true');
    myfunction2(); // call below written function 
}

function myfunction2() {

    var name = Date.now();

    var storageRef = firebase.storage().ref('/images/' + name);

    var uploadTask = storageRef.put(selectedFile);

    uploadTask.on('state_changed', function (snapshot) {
       
        switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED:
                console.log('Upload is paused');
                break;
            case firebase.storage.TaskState.RUNNING:
                console.log('Upload is running');
                break;
        }
    }, function (error) {
        console.log(error);
    }, function () {

        // get the uploaded image url back 
        uploadTask.snapshot.ref.getDownloadURL().then(
            function (downloadURL) {

                document.getElementById('url2').value = downloadURL;
                $('#image2').attr("src", downloadURL);

                console.log(downloadURL);
                document.getElementById('submit_link').removeAttribute('disabled');
            });
    });
};