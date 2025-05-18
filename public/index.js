var map;
var markers = [];
var boundryMarkers = [];
var  doneEvent = false;
var locations = [];
var marker;
var addHiveLocations = false;
var addFarmBoundries = true;
var paht;

var poly;
var farmBoundries = [];

(async () => {
    // const { google } = window;
    const { Map } = await google.maps.importLibrary("maps");
    map = new Map(document.getElementById("map"), {
        center: { lat: -25.363882, lng: 131.044922  },
        zoom: 5,
    });

    // to use searchAdderess function
    const image =
    "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";

    marker = new google.maps.Marker({
        map,
        icon: image
    });
    // to use draw farm boundries
    poly = new google.maps.Polyline({
        strokeColor: "#000000",
        strokeOpacity: 1.0,
        strokeWeight: 3,
      });
    poly.setMap(map);  

 
    // This event listener will call addMarker() when the map is clicked.
    map.addListener("click", (event) => {

        // hive location part
        if (addHiveLocations === true){
            // this functions trigers only if  the submit boundries button clicked
            addMarker(event.latLng, map);
            locations = JSON.stringify(event.latLng.toJSON(), null, 2)
            var loc = JSON.parse(locations); // Contert string to boject
                
            document.getElementById("lon").value = loc["lng"];
            document.getElementById("lat").value = loc["lat"];
        }
        
        // farm boundry part
        else if (addFarmBoundries === true) {
             
            path = poly.getPath();
            path.push(event.latLng);

            //change the style of the boundry markers
            const svgMarker = {
                path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
                fillColor: "blue",
                fillOpacity: 0.9,
                strokeWeight: 0,
                rotation: 0,
                scale: 2,
                anchor: new google.maps.Point(0, 20),
            };

            boundryMarkers.push(new google.maps.Marker({
                position: event.latLng,
                title: "#" + path.getLength(),
                icon: svgMarker,
                map: map,
            }));
            farmBoundries.push(event.latLng.toJSON())
        }
        });
   

       
    // add event listeners for the buttons
    document
        .getElementById("show-markers")
        .addEventListener("click", showMarkers);
    document
        .getElementById("hide-markers")
        .addEventListener("click", hideMarkers);
    document
        .getElementById("delete-markers")
        .addEventListener("click", deleteMarkers);
    document
        .getElementById("delete-bourdry-markers")
        .addEventListener("click", deleteBoundryMarkers);

})();


//  BUTTONS ON THE MAP

// Adds a marker to the map and push to the array.
function addMarker(position, map) {
        
    if (map === undefined) {
        return; // Prevent adding markers when map is undefined
    }

    var marker = new google.maps.Marker({
        position,
        map,
    });

    markers.push(marker);
  
}

// Sets the map on all markers in the array.
function setMapOnAll(map, markers) {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

// Removes the markers from the map, but keeps them in the array.
function hideMarkers() {
    setMapOnAll(null, markers);
}

// Shows any markers currently in the array.
function showMarkers() {
    setMapOnAll(map, markers);
}

// Deletes all markers in the array by if marker is not in the table.
function deleteMarkers() {

    var locationCoordinatesList = [];
    var body = document.getElementById('tablebody'); // original table
    var noOfRaws = body.rows.length;  // number of raws in the original table

    // get the all location lat lon coordinates as objects form the original table as list of objects
    for (let i= 0; i<noOfRaws;i++){
        var coordinate = {}; 

        var lat = parseFloat(body.rows[i].cells[3].innerHTML);
        var lon = parseFloat(body.rows[i].cells[2].innerHTML);
        coordinate.lat = lat;
        coordinate.lon = lon;

        locationCoordinatesList.push(coordinate);
    }


    if (markers.length > 0) {

        // get the last marker's position data as a object
        var lastMarker = markers[markers.length - 1];
        var lastMarkerCoordinate = lastMarker.getPosition();
        var lastMarkerLat = lastMarkerCoordinate.lat();
        var lastMarkerLng = lastMarkerCoordinate.lng();
        var lastMarkerPosition = {lat:lastMarkerLat, lon:lastMarkerLng}
  

        // Check if the targetObject is present in the object list (table )
        var isObjectPresent = locationCoordinatesList.some(function (obj) {
            // Compare objects by stringifying them and comparing the resulting strings
            return JSON.stringify(obj) === JSON.stringify(lastMarkerPosition);
        });

        if(!isObjectPresent){

            if (markers.length > 0 ) {
                markers[markers.length - 1].setMap(null); // Remove the last added marker from the map
                markers.pop(); // Remove it from the array
                showMarkers(); // Display the map with the updated markers
                
            }

        }

    }

}
// delete one by one the boundry lines and markers
function deleteBoundryMarkers(){

    if(boundryMarkers.length >0 & addHiveLocations===false){
        path.pop()
        boundryMarkers[boundryMarkers.length - 1].setMap(null)
        boundryMarkers.pop()
    }   
}







//  BUTTONS ON THE PAGE

// Add Data to the table
function addData(){

      
    //get the text box values
    var area = document.getElementById('area').value;
    var location = document.getElementById('location').value;
    var lat = parseFloat(document.getElementById('lat').value);
    var lon = parseFloat(document.getElementById('lon').value);
    var frames = parseFloat(document.getElementById('frames').value);
    var imgs = "nan"

    if(area && location && lat && lon && frames ){

      //insert raws
      var body = document.getElementById('tablebody');
      var newRaw = body.insertRow(body.rows.length);
      var cell1 = newRaw.insertCell(0);
      var cell2 = newRaw.insertCell(1);
      var cell3 = newRaw.insertCell(2);
      var cell4 = newRaw.insertCell(3);
      var cell5 = newRaw.insertCell(4);
      var cell6 = newRaw.insertCell(5);


      //update cells
      cell1.innerHTML = area;
      cell2.innerHTML = location ;
      cell3.innerHTML =  lon ;
      cell4.innerHTML = lat;
      cell5.innerHTML = frames; 
      cell6.innerHTML = imgs; 

      
      // clear the input fields
      document.getElementById('area').value ="";
      document.getElementById('location').value ="";
      document.getElementById('lat').value ="";
      document.getElementById('lon').value ="";
      document.getElementById('frames').value ="";

    }

    else{
      alert("Fill all data fields");
    } 
}

// clear data from the inster fields  
function clearFields(){

    document.getElementById('area').value ="";
    document.getElementById('area').value ="";
    document.getElementById('location').value ="";
    document.getElementById('lat').value ="";
    document.getElementById('lon').value ="";
    document.getElementById('frames').value ="";
      
  }
  

// search added data 
function searchData(){

    var locationCodeList = [];
    var body = document.getElementById('tablebody'); // original table
    var searchBody = document.getElementById('searchResults'); // search result table
    var noOfRaws = body.rows.length;  // number of raws in the original table

    // get the all location codes form the original table
    for (let i= 0; i<noOfRaws;i++){
        var locCode = body.rows[i].cells[1].innerHTML;
        locationCodeList.push(locCode);
    }


    // get the inserterd data in search box
    var locationCode = document.getElementById("searchLocation").value; 


    if(locationCodeList.includes(locationCode) ){

        searchBody.style.opacity = 1.0; // show the search result table

        var index = locationCodeList.indexOf(locationCode); // get the index of the entered location code of the table
        var area =  body.rows[index].cells[0].innerHTML;
        var lat =  parseFloat(body.rows[index].cells[3].innerHTML);
        var lon =  parseFloat(body.rows[index].cells[2].innerHTML);
        var frames =  parseFloat(body.rows[index].cells[4].innerHTML);
        var imgs = "nan"
        body.style.opacity = 0.0;  // hide the original table

        //update the table with new search detail
        var newRaw = searchBody.insertRow(searchBody.rows.length);
        var cell1 = newRaw.insertCell(0);
        var cell2 = newRaw.insertCell(1);
        var cell3 = newRaw.insertCell(2);
        var cell4 = newRaw.insertCell(3);
        var cell5 = newRaw.insertCell(4);
        var cell6 = newRaw.insertCell(5);


        cell1.innerHTML = area;
        cell2.innerHTML = locationCode;
        cell3.innerHTML = lon ;
        cell4.innerHTML = lat;
        cell5.innerHTML = frames;
        cell6.innerHTML = imgs;



    }
    // if search data is not in the original table
    else{
        alert("No result Found!");
    } 

}


// clean the search reasults and load the original table
function backToOriginalTable(){

    var body = document.getElementById('tablebody');
    var searchBody = document.getElementById('searchResults');

    // remvoe searching resault table
    while(searchBody.firstChild){
        searchBody.removeChild(searchBody.firstChild)
    }  

    searchBody.style.opacity = 0.0;
    body.style.opacity = 1.0;

}



// delete the data form the table
function deleteData(){
    var locationCodeList = [];
    var body = document.getElementById('tablebody'); // original table
    var searchBody = document.getElementById('searchResults'); // search result table
    var noOfRaws = body.rows.length;  // number of raws in the original table
    var noOfRawsSearch = searchBody.rows.length;  // number of raws in the searchdata table


    // get the all location codes form the original table
    for (let i= 0; i<noOfRaws;i++){
        var locCode = body.rows[i].cells[1].innerHTML;
        locationCodeList.push(locCode);
    }


    // get the inserterd data in search box
    var locationCode = document.getElementById("searchLocation").value; 

    if(noOfRawsSearch>=1){

        var index = locationCodeList.indexOf(locationCode); // get the index of the entered location code of the table
        body.removeChild(body.rows[index]); // remove the raw from the table
        searchBody.style.opacity = 0.0;


        markers[index].setMap(null); // Remove deleted raw marker from the map
        markers.splice(index, 1);; // Remove it from the array
        showMarkers(); // Display the map with the updated markers
        

    }

    else{
        alert("First you need to search the raw!")
    }

}


// search the address and load the location on the map
function searcAddress() {
    
    marker.setMap(null); // remove precvious markers
    var request = { address: document.getElementById("address").value };
    var geocoder = new google.maps.Geocoder();
    geocoder
      .geocode(request)
      .then((result) => {
        const { results } = result;
  
        map.setCenter(results[0].geometry.location);
        map.setZoom(12)
        marker.setPosition(results[0].geometry.location);
        marker.setMap(map);
    
      })
      .catch((e) => {
        alert("Geocode was not successful for the following reason: " + e);
      });
}

function submitBoundries(){
    if (boundryMarkers.length >= 4){
        addHiveLocations = true;
        console.log(farmBoundries)
    }

    else{
        alert("Not enough points to cover the entier farm. Check the boundries again !");
    }
    
}