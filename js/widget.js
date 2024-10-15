console.log("Script file loaded!"); // Test, ob die Datei geladen wird

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed."); // Test DOMContentLoaded

    // Modal 1
    var modal1 = document.getElementById("modal1");
    var widget1 = document.getElementById("widget1");
    var close1 = document.getElementById("close1");
    
    widget1.onclick = function() {
        console.log("Widget 1 clicked!"); // Test, ob das Widget 1 geklickt wird
        modal1.style.display = "block";
    }
    
    close1.onclick = function() {
        modal1.style.display = "none";
    }

    // Modal 2
    var modal2 = document.getElementById("modal2");
    var widget2 = document.getElementById("widget2");
    var close2 = document.getElementById("close2");
    
    widget2.onclick = function() {
        console.log("Widget 2 clicked!"); // Test, ob das Widget 2 geklickt wird
        modal2.style.display = "block";
    }
    
    close2.onclick = function() {
        modal2.style.display = "none";
    }

    // Modal 3
    var modal3 = document.getElementById("modal3");
    var widget3 = document.getElementById("widget3");
    var close3 = document.getElementById("close3");
    
    widget3.onclick = function() {
        console.log("Widget 3 clicked!"); // Test, ob das Widget 3 geklickt wird
        modal3.style.display = "block";
    }
    
    close3.onclick = function() {
        modal3.style.display = "none";
    }

    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target == modal1) {
            modal1.style.display = "none";
        }
        if (event.target == modal2) {
            modal2.style.display = "none";
        }
        if (event.target == modal3) {
            modal3.style.display = "none";
        }
    }
});
